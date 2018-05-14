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

function User(login, password) {
  this.login = login;
  this.password = password;
}
const users = [
  new User('Dima', '12345'),
  new User('Ivan', '54321'),
  new User('Magamed', '11111'),
  new User('Anastasia', '11111'),
  new User('Vova', '11111'),
  new User('Petia', '11111'),
  new User('Vasia', '11111'),
];

const model = (function () {
  function getPhotoPosts(skip, top, filterConfig) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      if (skip === undefined) {
        skip = 0;
      }

      if (top === undefined) {
        top = 10;
      }

      xhr.open('POST', `getPhotoPosts?skip=${skip}&top=${top}`, true);

      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
          reject(new Error(xhr.responseText));
        }
        else {
          let photoPosts;
          photoPosts = JSON.parse(xhr.responseText, function (key, value) {
            if (key == 'createdAt')
              return new Date(value);
            return value;
          });
          resolve(photoPosts);
        }
      }

      if (filterConfig !== undefined) {
        xhr.send(JSON.stringify(filterConfig));
      }
      else {
        xhr.send();
      }
    });
  }

  function getPhotoPost(id) {
    return new Promise((resolve, reject) => {
      if (id === undefined) {
        reject(new Error('Undefined ID'));
      }

      let xhr = new XMLHttpRequest();

      xhr.open('GET', `getPhotoPost/${id}`, true);

      let photoPost;

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
          reject(new Error(xhr.responseText));
        }
        else {
          photoPost = JSON.parse(xhr.responseText, function (key, value) {
            if (key === 'createdAt') {
              return new Date(value);
            }
            return value;
          });
          resolve(photoPost);
        }
      };

      xhr.send();
    });
  }

  function addPhotoPost(photoPost) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      if (photoPost === undefined) {
        reject(new Error('Undefined photopost'));
      }

      xhr.open('POST', 'addPhotoPost', true);

      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
          reject(new Error(xhr.responseText));
        } else {
          console.log(xhr.responseText);
          resolve('Operation successfull');
        }
      };

      xhr.send(JSON.stringify(photoPost));
    });
  }

  function removePhotoPost(id) {
    return new Promise((resolve, reject) => {
      if (id === undefined) {
        reject(new Error('ID undefined'));
      }

      let xhr = new XMLHttpRequest();

      xhr.open('DELETE', `removePhotoPost/${id}`, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
          reject(new Error(xhr.responseText));
        } else {
          console.log(xhr.responseText);
          resolve('Operation successfull');
        }
      };

      xhr.send();
    });
  }

  function editPhotoPost(id, photoPost) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      if (id === undefined) {
        reject(new Error('ID undefined'));
      }

      if (photoPost === undefined) {
        reject(new Error('Edit parameters undefined'));
      }

      xhr.open('PUT', `editPhotoPost/${id}`, true);

      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
          reject(new Error(xhr.responseText));
        } else {
          console.log(xhr.responseText);
          resolve('Operation successfull');
        }
      };

      xhr.send(JSON.stringify(photoPost));
    });
  }

  function findUniqueHashtags() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open('GET', 'findUniqueHashtags', true);

      let hashtags;

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
          reject(new Error(xhr.responseText));
        } else {
          hashtags = JSON.parse(xhr.responseText);
          resolve(hashtags);
        }
      };

      xhr.send();
    });
  }

  function findUniqueNames() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open('GET', 'findUniqueNames', true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
          reject(new Error(xhr.responseText));
        } else {
          let names;
          names = JSON.parse(xhr.responseText);
          resolve(names);
        }
      };

      xhr.send();
    });
  }

  function downloadFile(file) {
    return new Promise((resolve, reject) => {
      if (file === null || file === undefined) {
        reject(new Error('Sorry, some problems with image file occured'));
      }

      let xhr = new XMLHttpRequest();

      xhr.open('POST', 'downloadFile', true);

      let formData = new FormData();
      formData.append('file', file);

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
          reject(new Error(xhr.responseText));
        } else {
          let fileName;
          fileName = JSON.parse(xhr.responseText);
          resolve(fileName);
        }
      };

      xhr.send(formData);
    });
  }

  async function longPollingControl() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', 'subscribe', true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);

          longPollingControl();

          console.log(xhr.responseText);
        } else {
          let photoPost = JSON.parse(xhr.responseText, function (key, value) {
            if (key === 'createdAt') {
              return new Date(value);
            }
            return value;
          });
          if (currentState === statesMassive.mainState) {
            if (document.getElementById(photoPost.id) === null) {
              if (view.isSatisfyingFilter(photoPost)) {
                view.addPostToDom(photoPost);
              }
            }
          }
        }
        longPollingControl();
        resolve();
      }
      xhr.send();
    });
  }

  longPollingControl();

  return {
    getPhotoPosts: getPhotoPosts,
    getPhotoPost: getPhotoPost,
    addPhotoPost: addPhotoPost,
    removePhotoPost: removePhotoPost,
    editPhotoPost: editPhotoPost,
    findUniqueHashtags: findUniqueHashtags,
    findUniqueNames: findUniqueNames,
    downloadFile: downloadFile
  }
}());