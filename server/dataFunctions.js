const fs = require('fs');
const mongoose = require('mongoose');

const dataFunctions = (function () {
  function Photopost(id, description, createdAt, author, photolink, likes, hashtags, isDeleted = false) {
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
    this.likes = likes || [];
    this.hashtags = hashtags || [];
    this.isDeleted = isDeleted;
  }

  const photoPostsSchema = new mongoose.Schema({
    id: String,
    description: String,
    createdAt: Date,
    author: String,
    photoLink: String,
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

  async function findUniqueHashtags() {
    let photoPosts = await readPostsFile();

    let hashtags = [];
    for (let i = 0; i < photoPosts.length; i += 1) {
      for (let j = 0; j < photoPosts[i].hashtags.length; j += 1) {
        if (hashtags.every(item => item !== photoPosts[i].hashtags[j])) {
          hashtags.push(photoPosts[i].hashtags[j]);
        }
      }
    }

    return hashtags;
  }

  async function findUniqueNames() {
    let photoPosts = await readPostsFile();

    let authorNames = [];
    for (let i = 0; i < photoPosts.length; i += 1) {
      if (authorNames.every(item => item !== photoPosts[i].author)) {
        authorNames.push(photoPosts[i].author);
      }
    }

    return authorNames;
  }

  async function getMaxID() {
    let photoPosts = await readPostsFile();

    if (photoPosts.length === 0) {
      return null;
    }
    let max = photoPosts[0].id;
    for (let index = 1; index < photoPosts.length; index += 1) {
      if (parseInt(photoPosts[index].id, 10) > parseInt(max, 10)) {
        max = photoPosts[index].id;
      }
    }
    return max;
  }

  async function getNewID() {
    let newID;
    let maxID = await getMaxID();
    if (maxID === null) {
      newID = '1';
    } else {
      newID = `${parseInt(maxID, 10) + 1}`;
    }
    return newID;
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

  function validatePhotoPost(photoPost, photoPosts) {
    if (typeof (photoPost.id) !== 'string' || typeof (photoPost.description) !== 'string' || typeof (photoPost.author) !== 'string' || typeof (photoPost.photolink) !== 'string') {
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
    if (!photoPosts.every(item => item.id !== photoPost.id)) {
      return false;
    }

    return true;
  }

  async function addPhotoPost(photoPost) {
    let photoPosts = await readPostsFile();

    photoPost.id = await getNewID();

    if (validatePhotoPost(photoPost, photoPosts)) {
      photoPosts.push(photoPost);
      await writePostsFile(photoPosts);
      return true;
    }
    return false;
  }

  async function getPhotoPost(id) {
    let photoPosts = await readPostsFile();

    for (let index = 0; index < photoPosts.length; index += 1) {
      if (photoPosts[index].id === id && !photoPosts[index].isDeleted) {
        return photoPosts[index];
      }
    }
    return undefined;
  }

  async function getPhotoPostIndex(id) {
    let photoPosts = await readPostsFile();

    for (let index = 0; index < photoPosts.length; index += 1) {
      if (photoPosts[index].id === id && !photoPosts[index].isDeleted) {
        return index;
      }
    }

    return undefined;
  }

  function clone(params) {
    let clonex = {};

    for (let i = 0; i < Object.keys(params).length; i += 1) {
      clonex[Object.keys(params)[i]] = params[Object.keys(params)[i]];
    }

    return clonex;
  }

  async function editPhotoPost(id, photoPost) {
    let photoPosts = await readPostsFile();

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

    buff = clone(buff);

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
    photoPosts[await getPhotoPostIndex(id)] = clone(buff);

    await writePostsFile(photoPosts);

    return true;
  }

  async function reanimatePhotoPost(id) {
    let photoPosts = await readPostsFile();

    if (typeof (id) === 'string') {
      for (let index = 0; index < photoPosts.length; index += 1) {
        if (photoPosts[index].isDeleted) {
          if (photoPosts[index].id === id) {
            photoPosts[index].isDeleted = false;

            await writePostsFile(photoPosts);

            return true;
          }
        }
      }
    }
    return false;
  }

  async function removePhotoPost(id) {
    let photoPosts = await readPostsFile();

    if (typeof (id) === 'string') {
      for (let index = 0; index < photoPosts.length; index += 1) {
        if (!photoPosts[index].isDeleted) {
          if (photoPosts[index].id === id) {
            photoPosts[index].isDeleted = true;

            await writePostsFile(photoPosts);

            return true;
          }
        }
      }
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

  async function getPhotoPosts(skip, top, filterConfig) {
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

    let photoPosts = await readPostsFile();

    photoPosts.sort(datesort);

    let buffmass;
    if (filterConfig !== undefined) {
      buffmass = photoPosts.filter(function (param) {
        if (param.isDeleted) {
          return false;
        }

        if (filterConfig.author !== undefined) {
          if (typeof (filterConfig.author) === 'string') {
            if (filterConfig.author !== param.author) {
              return false;
            }
          }
        }
        if (filterConfig.createdAt !== undefined) {
          if (typeof (filterConfig.createdAt) === 'object') {
            if (filterConfig.createdAt.getFullYear() !== param.createdAt.getFullYear() || filterConfig.createdAt.getMonth() !== param.createdAt.getMonth() || filterConfig.createdAt.getDate() !== param.createdAt.getDate()) {
              return false;
            }
          }
        }
        if (filterConfig.hashtags !== undefined) {
          if (typeof (filterConfig.hashtags) === 'object') {
            for (let index = 0; index < filterConfig.hashtags.length; index += 1) {
              let flag = false;
              for (let index2 = 0; index2 < param.hashtags.length; index2 += 1) {
                if (param.hashtags[index2] === filterConfig.hashtags[index]) {
                  flag = true;
                  break;
                }
              }
              if (!flag) {
                return false;
              }
            }
          }
        }
        return true;
      });
    } else {
      buffmass = photoPosts.filter((el) => {
        if (el.isDeleted) {
          return false;
        }
        return true;
      });
    }

    return JSON.stringify(buffmass.slice(skip, skip + top));
  }

  async function fillDataBase() {
    let photoPosts = await readPostsFile();

    photoPosts.every(function (item) {
      let post = new Posts({
        id: item.id,
        description: item.description,
        createdAt: item.createdAt,
        author: item.author,
        photoLink: item.photoLink,
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
