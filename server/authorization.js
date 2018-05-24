const fs = require('fs');
const crypt = require('./crypt.js');


const authorization = (function () {
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
    let users = await readUsersFile();

    let user;
    users.every((el) => {
      if (el.login === login) {
        user = el;
        return false;
      }
      return true;
    });

    if (user !== undefined) {
      let usersHash = crypt.getPasswordHash(password, user.secret);

      if (user.hash === usersHash) {
        return user;
      }

      return null;
    }

    return null;
  }

  return {
    readUsersFile,
    writeUsersFile,
    checkPassword,
  };
}());

module.exports = authorization;
