const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');
const multer = require('multer');
const dataFunctions = require('./dataFunctions.js');

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

var ress = [];

//fs.writeFileSync('filter.json', JSON.stringify({author: 'Dima'}));



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

app.get('/findUniqueHashtags', async function (req, res) {
    let result = await dataFunctions.findUniqueHashtags();
    if (result !== undefined) {
        res.status(200).send(JSON.stringify(result));   
    }
    else {
        res.status(400).send(`Operation "findUniqueHashtags" failed`);
    }
})

app.get('/findUniqueNames', async function (req, res) {
    let result = await dataFunctions.findUniqueNames();
    if (result !== undefined) {
        res.status(200).send(JSON.stringify(result));   
    }
    else {
        res.status(400).send(`Operation "findUniqueNames" failed`);
    }
})

app.get('/getPhotoPost/:id', async function (req, res) {
    let post = await dataFunctions.getPhotoPost(req.params.id);
    if (post !== undefined) {
        post = JSON.stringify(post);
        res.status(200).send(post);
    }
    else {
        res.status(400).send(`Photopost with id = ${req.params.id} not found`);
    }
})

app.post('/getPhotoPosts', async function (req, res) {
    let skip = req.query.skip;
    let top = req.query.top;
    let filterConfig = req.body;
    //filterConfig = JSON.stringify(filterConfig);

    //console.log(filterConfig);

    let answer = await dataFunctions.getPhotoPosts(skip, top, filterConfig);
    //console.log(answer);
    if (answer !== undefined) {
        res.status(200).send(answer);
    }
    else {
        res.status(400).send('Error');
    }
})

app.post('/addPhotoPost', async function (req, res) {
    if (await dataFunctions.addPhotoPost(req.body)) {
        ress.forEach((response) => {
            response.status(200).send(JSON.stringify(req.body));
        })
        ress.splice(0, ress.length);
        res.status(200).send(`Photopost was successfully added`);
    }
    else {
        res.status(400).send(`Operation failed`);
    }
})

app.put('/reanimatePhotoPost/:id', async function (req, res) {
    if (await dataFunctions.reanimatePhotoPost(req.params.id)) {
        res.status(200).send(`Photopost with id = ${req.params.id} was successfully recovered`);
    }
    else {
        res.status(404).send('Operation failed');
    }
})

app.put('/editPhotoPost/:id', async function (req, res) {
    if (await dataFunctions.editPhotoPost(req.params.id, req.body)) {
        res.status(200).send(`Photopost with id = ${req.params.id} was successfully edited`);
    }
    else {
        res.status(400).send('Operation failed');
    }
})

app.delete('/removePhotoPost/:id', async function (req, res) {
    if (await dataFunctions.removePhotoPost(req.params.id)) {
        res.status(200).send(`Post with id = ${req.params.id} was successfully deleted`);
    }
    else {
        res.status(404).send(`Post with id = ${req.params.id} was not found`);
    }
})

app.post('/downloadFile', upload.single('file'), async function (req, res) {
    let filename = req.file.filename;
    console.log(filename);
    if (filename !== null) {
        res.status(200).send(JSON.stringify('./ImagesAndIcons/' + filename));
    }
    else {
        res.status(400).send('Photo downloading failed');
    }
})

app.get('/subscribe', async (req, res, next) => {
    ress.push(res);
    console.log(`Number of subscribers: ${ress.length}`);
});

app.listen(3000, function () {
    console.log('Server is running...');
});