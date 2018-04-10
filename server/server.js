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
    /*let bufff = typeof (photoPost.id);
    bufff = typeof (photoPost.description);
    bufff = typeof (photoPost.photolink);
    bufff = typeof (photoPost.author);*/
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