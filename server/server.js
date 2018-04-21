const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/UI/ImagesAndIcons');
    },
    filename: function (req, file, cb) {
        console.log('FileFieldname:');
        console.log(file.fieldname);
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage });

const app = express();

//fs.writeFileSync('filter.json', JSON.stringify({author: 'Dima'}));

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

function readPostsFile() {
    let stringOfPosts = fs.readFileSync('./data/posts.json');
    let photoPosts = JSON.parse(stringOfPosts, function (key, value) {
        if (key == 'createdAt') {
            return new Date(value);
        }
        return value;
    })

    return photoPosts;
}

function writePostsFile(photoPosts) {
    fs.writeFileSync('./data/posts.json', JSON.stringify(photoPosts));
}

function findUniqueHashtags() {
    let photoPosts = readPostsFile();

    let hashtags = [];
    for (let i = 0; i < photoPosts.length; i++) {
        for (let j = 0; j < photoPosts[i].hashtags.length; j++) {
            if (hashtags.every(item => item !== photoPosts[i].hashtags[j])) {
                hashtags.push(photoPosts[i].hashtags[j]);
            }
        }
    }

    return hashtags;
}

function findUniqueNames() {
    let photoPosts = readPostsFile();

    let authorNames = [];
    for (let i = 0; i < photoPosts.length; i++) {
        if (authorNames.every(item => item !== photoPosts[i].author)) {
            authorNames.push(photoPosts[i].author);
        }
    }

    return authorNames;
}

function getMaxID() {
    let photoPosts = readPostsFile();

    if (photoPosts.length === 0) {
        return null;
    }
    let max = photoPosts[0].id;
    for (let index = 1; index < photoPosts.length; index++) {
        if (parseInt(photoPosts[index].id, 10) > parseInt(max, 10)) {
            max = photoPosts[index].id
        }
    }
    return max;
}

function getNewID() {
    let newID;
    let maxID = getMaxID();
    if (maxID === null) {
        newID = '1';
    }
    else {
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
    for (let index = 1; index < item.length; index++) {
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

function addPhotoPost(photoPost) {
    let photoPosts = readPostsFile();

    photoPost.id = getNewID();

    if (validatePhotoPost(photoPost, photoPosts)) {
        photoPosts.push(photoPost);
        writePostsFile(photoPosts);
        return true;
    }
    return false;
}

function getPhotoPost(id) {
    let photoPosts = readPostsFile();

    for (var index = 0; index < photoPosts.length; index++) {
        if (photoPosts[index].id === id && !photoPosts[index].isDeleted) {
            return photoPosts[index];
        }
    }
}

function getPhotoPostIndex(id) {
    let photoPosts = readPostsFile();

    for (var index = 0; index < photoPosts.length; index++) {
        if (photoPosts[index].id === id && !photoPosts[index].isDeleted) {
            return index;
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
    //photoPost = JSON.parse(photoPost);

    let photoPosts = readPostsFile();

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
            if (isValidHash(photoPost.hashtags[index])) {
                buff.hashtags.push(photoPost.hashtags[index]);
            }
        }
    }
    photoPosts[getPhotoPostIndex(id)] = clone(buff);

    writePostsFile(photoPosts);

    return true;
}

function reanimatePhotoPost(id) {
    let photoPosts = readPostsFile();

    if (typeof (id) === 'string') {
        for (var index = 0; index < photoPosts.length; index++) {
            if (photoPosts[index].isDeleted) {
                if (photoPosts[index].id === id) {
                    //photoPosts.splice(index, 1);
                    photoPosts[index].isDeleted = false;

                    writePostsFile(photoPosts);

                    return true;
                }
            }
        }
    }
    return false;
}

function removePhotoPost(id) {
    let photoPosts = readPostsFile();

    if (typeof (id) === 'string') {
        for (var index = 0; index < photoPosts.length; index++) {
            if (!photoPosts[index].isDeleted) {
                if (photoPosts[index].id === id) {
                    //photoPosts.splice(index, 1);
                    photoPosts[index].isDeleted = true;

                    writePostsFile(photoPosts);

                    return true;
                }
            }
        }
    }
    return false;
}

function datesort(a, b) {
    var dif = b.createdAt - a.createdAt;
    if (dif > 0) {
        return 1;
    }
    if (dif < 0) {
        return -1;
    }
    return 0;
}

function getPhotoPosts(skip, top, filterConfig) {
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

    let photoPosts = readPostsFile();

    photoPosts.sort(datesort);

    if (filterConfig !== undefined) {
        //Функция фильтрации
        function filtfunc(param) {
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
                    for (var index = 0; index < filterConfig.hashtags.length; index++) {
                        var flag = false;
                        for (var index2 = 0; index2 < param.hashtags.length; index2++) {
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
            //////////
            return true;
        }
        var buffmass = photoPosts.filter(filtfunc);//фильтрация
    }
    else {
        var buffmass = photoPosts.filter(el => {
            if (el.isDeleted) {
                return false;
            }
            return true;
        });//Need to filter only deleted elements
    }

    return JSON.stringify(buffmass.slice(skip, skip + top));//отбрасывание первых skip элементов массива и взятие последующих top элементов
}

function parseDate(key, value) {
    if (key === 'createdAt' && typeof value === 'string') {
        return new Date(value);
    }
    return value;
}

app.use(bodyParser.json({ reviver: parseDate }));
//app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../public/UI'));

app.get('/findUniqueHashtags', function (req, res) {
    res.send(200, JSON.stringify(findUniqueHashtags()));
})

app.get('/findUniqueNames', function (req, res) {
    res.send(200, JSON.stringify(findUniqueNames()));
})

app.get('/getPhotoPost/:id', function (req, res) {
    let post = getPhotoPost(req.params.id);
    if (post !== undefined) {
        post = JSON.stringify(post);
        res.send(200, post);
    }
    res.send(400, `Photopost with id = ${req.params.id} not found`);
})

app.post('/getPhotoPosts', function (req, res) {
    let skip = req.query.skip;
    let top = req.query.top;
    let filterConfig = req.body;
    //filterConfig = JSON.stringify(filterConfig);

    console.log(filterConfig);

    let answer = getPhotoPosts(skip, top, filterConfig);
    //console.log(answer);
    if (answer !== undefined) {
        res.send(200, answer);
    }
    res.send(400, 'Error');
})

app.post('/addPhotoPost', function (req, res) {
    if (addPhotoPost(req.body)) {
        res.send(200, `Photopost was successfully added`);
    }
    res.send(400, `Operation failed`);
})

app.put('/reanimatePhotoPost/:id', function (req, res) {
    if (reanimatePhotoPost(req.params.id)) {
        res.send(200, `Photopost with id = ${req.params.id} was successfully recovered`);
    }
    res.send(404, 'Operation failed');
})

app.put('/editPhotoPost/:id', function (req, res) {
    if (editPhotoPost(req.params.id, req.body)) {
        res.send(200, `Photopost with id = ${req.params.id} was successfully edited`);
    }
    res.send(400, 'Operation failed');
})

app.delete('/removePhotoPost/:id', function (req, res) {
    if (removePhotoPost(req.params.id)) {
        res.send(200, `Post with id = ${req.params.id} was successfully deleted`);
    }
    res.send(404, `Post with id = ${req.params.id} was not found`);
})

app.post('/downloadFile', upload.single('file'), function (req, res) {
    let filename = req.file.filename;
    console.log(filename);
    if (filename !== null) {
        res.send(200, JSON.stringify('./ImagesAndIcons/' + filename));
    }
    else {
        res.send(400, 'Photo downloading failed');
    }
})

app.listen(3000, function () {
    console.log('Server is running...');
});