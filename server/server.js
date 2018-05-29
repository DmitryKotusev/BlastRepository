const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const dataFunctions = require('./dataFunctions.js');
const passport = require('passport');
const JsonStrategy = require('passport-json').Strategy;

const session = require('express-session');
const authorization = require('./authorization.js');
const mongoose = require('mongoose');

async function connectToDataBase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/photoPostsData');
    console.log('Successfully connected');
  } catch (error) {
    console.log(error);
  }
}

const storagex = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../public/UI/ImagesAndIcons');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storagex });

const app = express();

let arrayOfSubcribers = [];

function parseDate(key, value) {
  if (key === 'createdAt' && typeof value === 'string') {
    return new Date(value);
  }
  return value;
}

app.use(bodyParser.json({ reviver: parseDate }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../public/UI'));
// app.use(express.cookieParser());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new JsonStrategy(async function (username, password, done) {
  try {
    let user = await authorization.checkPassword(username, password);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser method worked');
  authorization.Users.findById(id, function (err, user) {
    done(err, user);
  });
});

app.post('/login', passport.authenticate('json', { failureRedirect: '/loginfail' }), async (req, res) => {
  res.redirect('/');
});

app.get('/loginfail', async (req, res) => {
  res.status(200).send(false);
});

app.get('/logout', async (req, res) => {
  req.logout();
  res.status(200).send(true);
});

app.get('/findUniqueHashtags', async function (req, res) {
  let result = await dataFunctions.findUniqueHashtags();
  if (result !== undefined) {
    res.status(200).send(JSON.stringify(result));
  } else {
    res.status(400).send('Operation "findUniqueHashtags" failed');
  }
});

app.get('/findUniqueNames', async function (req, res) {
  let result = await dataFunctions.findUniqueNames();
  if (result !== undefined) {
    res.status(200).send(JSON.stringify(result));
  } else {
    res.status(400).send('Operation "findUniqueNames" failed');
  }
});

app.get('/getPhotoPost/:id', async function (req, res) {
  let post = await dataFunctions.getPhotoPost(req.params.id);
  if (post !== undefined) {
    post = JSON.stringify(post);
    res.status(200).send(post);
  } else {
    res.status(400).send(`Photopost with id = ${req.params.id} not found`);
  }
});

app.post('/getPhotoPosts', async function (req, res) {
  let skipx = req.query.skip;
  let topx = req.query.top;
  let filterConfig = req.body;

  let answer = await dataFunctions.getPhotoPosts(skipx, topx, filterConfig);
  if (answer !== undefined) {
    res.status(200).send(answer);
  } else {
    res.status(400).send('Error');
  }
});

app.post('/addPhotoPost', async function (req, res) {
  if (await dataFunctions.addPhotoPost(req.body)) {
    arrayOfSubcribers.forEach((response) => {
      response.status(200).send(JSON.stringify(req.body));
    });
    arrayOfSubcribers.splice(0, arrayOfSubcribers.length);
    res.status(200).send('Photopost was successfully added');
  } else {
    res.status(400).send('Operation failed');
  }
});

app.put('/reanimatePhotoPost/:id', async function (req, res) {
  if (await dataFunctions.reanimatePhotoPost(req.params.id)) {
    res.status(200).send(`Photopost with id = ${req.params.id} was successfully recovered`);
  } else {
    res.status(404).send('Operation failed');
  }
});

app.put('/editPhotoPost/:id', async function (req, res) {
  if (await dataFunctions.editPhotoPost(req.params.id, req.body)) {
    res.status(200).send(`Photopost with id = ${req.params.id} was successfully edited`);
  } else {
    res.status(400).send('Operation failed');
  }
});

app.delete('/removePhotoPost/:id', async function (req, res) {
  if (await dataFunctions.removePhotoPost(req.params.id)) {
    res.status(200).send(`Post with id = ${req.params.id} was successfully deleted`);
  } else {
    res.status(404).send(`Post with id = ${req.params.id} was not found`);
  }
});

app.post('/downloadFile', upload.single('file'), async function (req, res) {
  let filenamex = req.file.filename;
  console.log(filenamex);
  if (filenamex !== null) {
    res.status(200).send(JSON.stringify(`./ImagesAndIcons/${filenamex}`));
  } else {
    res.status(400).send('Photo downloading failed');
  }
});

app.get('/subscribe', async (req, res, next) => {
  arrayOfSubcribers.push(res);
  console.log(`Number of subscribers: ${arrayOfSubcribers.length}`);
});

app.listen(3000, function () {
  console.log('Server is running...');
});

connectToDataBase();

// dataFunctions.cleanDataBase();
// dataFunctions.fillDataBase();
// authorization.fillDataBase();
