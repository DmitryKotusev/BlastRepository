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