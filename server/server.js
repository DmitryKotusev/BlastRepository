const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');

const app = express();

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

function validatePhotoPost(photoPost) {
    if (typeof (photoPost.id) !== 'string' || typeof (photoPost.description) !== 'string' || typeof (photoPost.author) !== 'string' || typeof (photoPost.photolink) !== 'string') {
        return false;
    }
    if (photoPost.description.length >= 200 || photoPost.description.length == 0) {
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
    if (!photoPost.hashtags.every(validhash)) {
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

function addPhotoPost(photoPost) {
    photoPost = JSON.parse(photoPost, function (key, value) {
        if (key == 'createdAt')
        {
            return new Date(value);
        }
        return value;
    })
    if (validatePhotoPost(photoPost)) {
        let stringOfPosts = fs.readFileSync('./data/photoPosts.json');
        let photoPosts =  JSON.parse(stringOfPosts, function (key, value) {
            if (key == 'createdAt')
            {
                return new Date(value);
            }
            return value;
        })
        photoPosts.push(photoPost);
        fs.writeFileSync('./data/photoPosts.json', JSON.stringify(photoPosts));
        return true;
    }
    return false;
}

function getPhotoPost(id) {
    for (var index = 0; index < photoPosts.length; index++) {
        if (photoPosts[index].id === id && !photoPosts[index].isDeleted) {
            return photoPosts[index];
        }
    }
}

function clone(params) {
    var clone = {}; // new empty object

    for (var key in params) {
        clone[key] = params[key];
    }

    return clone;
}

function editPhotoPost(id, photoPost) {

    photoPost = JSON.parse(photoPost);

    let stringOfPosts = fs.readFileSync('/data/posts.json');
    let photoPosts =  JSON.parse(stringOfPosts, function (key, value) {
        if (key == 'createdAt')
        {
            return new Date(value);
        }
        return value;
    })

    if (typeof (id) !== 'string') {
        return false;
    }
    if (photoPost === undefined) {
        return false;
    }
    
    var buff = getPhotoPost(id);

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
        for (let index = 0; index < photoPost.hashtags.length; index++) {
            if (validhash(photoPost.hashtags[index])) {
                buff.hashtags.push(photoPost.hashtags[index]);   
            }
        }
    }
    photoPosts[i] = clone(buff);
    
    fs.writeFileSync('/data/posts.json', JSON.stringify(photoPosts));

    return true;
}

app.use(bodyParser.json());
//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('../public/UI'));

app.listen(3000, function () {
    console.log('Server is running...');
});

app.get('/getPhotoPost/:id', function (req, res)
{

})

app.post('/getPhotoPosts?skip&top', function (req, res)
{
    
})

app.post('/addPhotoPost', function (req, res)
{
    
})

app.put('/editPhotoPost/:id', function (req, res)
{
    
})

app.delete('/removePhotoPost/:id', function (req, res)
{
    
})