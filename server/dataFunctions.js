const fs = require('fs');
const mongoose = require('mongoose');

const dataFunctions = (function () {
  function Photopost(description, createdAt, author, photolink, likes, hashtags, isDeleted = false) {
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
    this.likes = likes || [];
    this.hashtags = hashtags || [];
    this.isDeleted = isDeleted;
  }

  const photoPostsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: String,
    createdAt: Date,
    author: String,
    photolink: String,
    hashtags: [String],
    likes: [String],
    isDeleted: Boolean,
  });

  const Posts = mongoose.model('Photoposts', photoPostsSchema);

  function readPostsFile() {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/posts.json', (err, data) => {
        if (err) {
          reject(err);
        } else {
          let photoPosts = JSON.parse(data, function (key, value) {
            if (key === 'createdAt') {
              return new Date(value);
            }
            return value;
          });
          resolve(photoPosts);
        }
      });
    });
  }

  function writePostsFile(photoPosts) {
    return new Promise((resolve, reject) => {
      fs.writeFile('./data/posts.json', JSON.stringify(photoPosts), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve('Operation successfull');
        }
      });
    });
  }

  async function findUniqueHashtags() { // Checked
    let hashtags = await Posts.aggregate([
      { $group: { _id: null, uniqueTags: { $push: '$hashtags' } } },
      {
        $project: {
          _id: 0,
          uniqueTags: {
            $reduce: {
              input: '$uniqueTags',
              initialValue: [],
              in: {
                $let: {
                  vars: { elem: { $concatArrays: ['$$this', '$$value'] } },
                  in: { $setUnion: '$$elem' },
                },
              },
            },
          },
        },
      },
    ]);
    let result = hashtags[0].uniqueTags;
    return result;
  }

  async function findUniqueNames() { // Checked
    let authorNames = await Posts.distinct('author');
    return authorNames;
  }

  function isValidHash(item) {
    if (typeof (item) !== 'string') {
      return false;
    }
    if (item.charAt(0) !== '#') {
      return false;
    }
    for (let index = 1; index < item.length; index += 1) {
      if (item.charAt(index) === ' ' || item.charAt(index) === '#' || item.charAt(index) === ',' || item.charAt(index) === '.') {
        return false;
      }
    }
    return true;
  }

  function validatePhotoPost(photoPost) { // Checked
    if (typeof (photoPost.description) !== 'string' || typeof (photoPost.author) !== 'string' || typeof (photoPost.photolink) !== 'string') {
      return false;
    }
    if (photoPost.description.length >= 200 || photoPost.description.length === 0) {
      return false;
    }
    if (photoPost.createdAt === 'Invalid Date') {
      return false;
    }
    if (!(Array.isArray(photoPost.likes))) {
      return false;
    }
    if (!(Array.isArray(photoPost.hashtags))) {
      return false;
    }
    function isString(item) {
      return (typeof (item) === 'string');
    }
    if (!photoPost.hashtags.every(isValidHash)) {
      return false;
    }
    if (!photoPost.hashtags.every(isString)) {
      return false;
    }
    // if (!photoPosts.every(item => item.id !== photoPost.id)) {
    //  return false;
    // }

    return true;
  }

  async function addPhotoPost(photoPost) { // Checked
    // let photoPosts = await readPostsFile();
    // photoPost.id = await getNewID();

    if (validatePhotoPost(photoPost)) {
      try {
        let post = new Posts({
          _id: new mongoose.Types.ObjectId(),
          description: photoPost.description,
          createdAt: photoPost.createdAt,
          author: photoPost.author,
          photolink: photoPost.photolink,
          hashtags: photoPost.hashtags,
          likes: photoPost.likes,
          isDeleted: photoPost.isDeleted,
        });

        await post.save((err) => {
          if (err) {
            throw new Error(err);
          }
        });
      } catch (error) {
        return false;
      }
      return true;
    }
    return false;
  }

  async function getPhotoPost(id) { // Checked
    let photoPost = Posts.findById(id);
    if (photoPost === null) {
      return undefined;
    }
    return photoPost;
  }

  function clone(params) {
    let clonex = {};

    for (let i = 0; i < Object.keys(params).length; i += 1) {
      clonex[Object.keys(params)[i]] = params[Object.keys(params)[i]];
    }

    return clonex;
  }

  async function editPhotoPost(id, photoPost) { // Checked
    // let photoPosts = await readPostsFile();

    if (typeof (id) !== 'string') {
      return false;
    }
    if (photoPost === undefined) {
      return false;
    }

    let buff = await getPhotoPost(id);

    if (buff === undefined) {
      return false;
    }

    if (photoPost.description !== undefined && typeof (photoPost.description) === 'string') {
      if (photoPost.description.length > 200) {
        return false;
      }
      buff.description = photoPost.description;
    }
    if (photoPost.photolink !== undefined && typeof (photoPost.photolink) === 'string') {
      buff.photolink = photoPost.photolink;
    }
    if ((Array.isArray(photoPost.likes))) {
      buff.likes = photoPost.likes;
    }
    if ((Array.isArray(photoPost.hashtags))) {
      buff.hashtags = [];
      for (let index = 0; index < photoPost.hashtags.length; index += 1) {
        if (isValidHash(photoPost.hashtags[index])) {
          buff.hashtags.push(photoPost.hashtags[index]);
        }
      }
    }
    // photoPosts[await getPhotoPostIndex(id)] = clone(buff);

    let result = await Posts.findByIdAndUpdate(id, {
      description: buff.description,
      hashtags: buff.hashtags,
      likes: buff.likes,
      photolink: buff.photolink,
    });
    return result;
  }

  async function reanimatePhotoPost(id) { // Checked
    if (typeof (id) === 'string') {
      let result = Posts.findByIdAndUpdate(id, { isDeleted: false });
      return result;
    }
    return false;
  }

  async function removePhotoPost(id) { // Checked
    if (typeof (id) === 'string') {
      let result = Posts.findByIdAndUpdate(id, { isDeleted: true });
      return result;
    }
    return false;
  }

  function datesort(a, b) {
    let dif = b.createdAt - a.createdAt;
    if (dif > 0) {
      return 1;
    }
    if (dif < 0) {
      return -1;
    }
    return 0;
  }

  async function getPhotoPosts(skip, top, filterConfig) { // Checked
    if (typeof (skip) === 'string') {
      skip = JSON.parse(skip);
    }
    if (typeof (top) === 'string') {
      top = JSON.parse(top);
    }
    if (typeof (filterConfig) === 'string') {
      filterConfig = JSON.parse(filterConfig);
    }

    skip = skip || 0;
    if (typeof (skip) !== 'number') {
      skip = 0;
    }

    top = top || 10;
    if (typeof (top) !== 'number') {
      top = 10;
    }

    let buffmass = {};
    buffmass.isDeleted = false;

    if (filterConfig !== undefined) {
      if (filterConfig.author !== undefined) {
        if (typeof (filterConfig.author) === 'string') {
          buffmass.author = filterConfig.author;
        }
      }

      if (filterConfig.createdAt !== undefined) {
        if (typeof (filterConfig.createdAt) === 'object') {
          buffmass.createdAt = filterConfig.createdAt;
        }
      }

      if (filterConfig.hashtags !== undefined) {
        if (typeof (filterConfig.hashtags) === 'object') {
          buffmass.hashtags = filterConfig.hashtags;
        }
      }
    }

    let result = await Posts.find(buffmass).sort({ 'createdAt': -1 }).skip(skip).limit(top);
    if (result === null) {
      return undefined;
    }
    return JSON.stringify(result);
  }

  async function fillDataBase() {
    let photoPosts = await readPostsFile();

    photoPosts.every(function (item) {
      let post = new Posts({
        _id: new mongoose.Types.ObjectId(),
        description: item.description,
        createdAt: item.createdAt,
        author: item.author,
        photolink: item.photolink,
        hashtags: item.hashtags,
        likes: item.likes,
        isDeleted: item.isDeleted,
      });

      post.save((err) => {
        if (err) {
          throw new Error(err);
        }
      });
      return true;
    });
  }

  async function cleanDataBase() {
    try {
      await Posts.remove({});
      return true;
    } catch (error) {
      return false;
    }
  }

  return {
    findUniqueHashtags,
    findUniqueNames,
    getPhotoPost,
    getPhotoPosts,
    addPhotoPost,
    reanimatePhotoPost,
    editPhotoPost,
    removePhotoPost,
    fillDataBase,
    cleanDataBase,
  };
}());

module.exports = dataFunctions;
