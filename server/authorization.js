const fs = require('fs');
const crypt = require('./crypt.js');
const mongoose = require('mongoose');

const authorization = (function () {
  const userSchema = new mongoose.Schema({
    login: String,
    hash: String,
    secret: String,
  });

  const Users = mongoose.model('Users', userSchema);

  function readUsersFile() {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/users.json', (err, data) => {
        if (err) {
          reject(err);
        } else {
          let users = JSON.parse(data);
          resolve(users);
        }
      });
    });
  }

  function writeUsersFile(users) {
    return new Promise((resolve, reject) => {
      fs.writeFile('./data/users.json', JSON.stringify(users), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve('Operation successfull');
        }
      });
    });
  }

  async function checkPassword(login, password) {
    let user = await Users.findOne({ login });

    if (user !== null) {
      let usersHash = crypt.getPasswordHash(password, user.secret);

      if (user.hash === usersHash) {
        return user;
      }

      return null;
    }

    return null;
  }

  async function fillDataBase() {
    let users = await readUsersFile();

    users.every(function (item) {
      let post = new Users({
        login: item.login,
        hash: item.hash,
        secret: item.secret,
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
      await Users.remove({});
      return true;
    } catch (error) {
      return false;
    }
  }

  return {
    readUsersFile,
    writeUsersFile,
    checkPassword,
    fillDataBase,
    cleanDataBase,
    Users,
  };
}());

module.exports = authorization;
