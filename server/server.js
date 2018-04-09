const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser');

const app = express();

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

app.post('/getPhotoPosts/:skip', function (req, res)
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