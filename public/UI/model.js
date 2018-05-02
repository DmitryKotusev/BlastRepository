'use strict';

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
//ВРЕМЕННО!!!
function user(login, password) {
    this.login = login;
    this.password = password;
}
var users = [
    new user('Dima', '12345'),
    new user('Ivan', '54321'),
    new user('Magamed', '11111'),
    new user('Anastasia', '11111'),
    new user('Vova', '11111'),
    new user('Petia', '11111'),
    new user('Vasia', '11111')
]
////////////
let model = function () {
    function getPhotoPosts(skip, top, filterConfig) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();

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
                    console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                    reject(undefined);
                }
                else {
                    var photoPosts;
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
                reject("Invalid ID");
            }

            var xhr = new XMLHttpRequest();

            xhr.open('GET', `getPhotoPost/${id}`, true);

            var photoPost;

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                    reject(undefined);
                }
                else {
                    photoPost = JSON.parse(xhr.responseText, function (key, value) {
                        if (key == 'createdAt')
                            return new Date(value);
                        return value;
                    });
                    resolve(photoPost);
                }
            }

            xhr.send();
        });
    }

    function addPhotoPost(photoPost) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();

            if (photoPost === undefined) {
                return false;
            }

            xhr.open('POST', `addPhotoPost`, true);

            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                    reject(false);
                }
                else {
                    console.log(xhr.responseText);
                    resolve(true);
                }
            }

            xhr.send(JSON.stringify(photoPost));
        });
    }

    function removePhotoPost(id) {
        return new Promise((resolve, reject) => {
            if (id === undefined) {
                return false;
            }

            var xhr = new XMLHttpRequest();

            xhr.open('DELETE', `removePhotoPost/${id}`, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                    reject(false);
                }
                else {
                    console.log(xhr.responseText);
                    resolve(true);
                }
            }

            xhr.send();
        });
    }

    function editPhotoPost(id, photoPost) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();

            if (id === undefined) {
                return false;
            }

            if (photoPost === undefined) {
                return false;
            }

            xhr.open('PUT', `editPhotoPost/${id}`, true);

            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                    reject(false);
                }
                else {
                    console.log(xhr.responseText);
                    resolve(true);
                }
            }

            xhr.send(JSON.stringify(photoPost));
        });
    }

    function findUniqueHashtags() {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', `findUniqueHashtags`, true);

            var hashtags;

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                    reject(undefined);
                }
                else {
                    hashtags = JSON.parse(xhr.responseText);
                    resolve(hashtags);
                }
            }

            xhr.send();
        });
    }

    function findUniqueNames() {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', `findUniqueNames`, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                    reject(undefined);
                }
                else {
                    let names;
                    names = JSON.parse(xhr.responseText);
                    resolve(names);
                }
            }

            xhr.send();
        });
    }

    function downloadFile(file) {
        return new Promise((resolve, reject) => {
            if (file === null || file === undefined) {
                return null;
            }

            var xhr = new XMLHttpRequest();

            xhr.open('POST', `downloadFile`, true);
            //xhr.setRequestHeader('Content-Type', 'multipart/form-data');

            var formData = new FormData();
            formData.append('file', file);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                    reject(null);
                }
                else {
                    let fileName;
                    fileName = JSON.parse(xhr.responseText);
                    resolve(fileName);
                }
            }

            xhr.send(formData);
        });
    }

    function longPollingControl() {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', `subscribe`, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    let photoPost = JSON.parse(xhr.responseText, function (key, value) {
                        if (key == 'createdAt')
                            return new Date(value);
                        return value;
                    });
                    //Вызвать метод для перерисовки DOM, если таковой нужен
                    if (currentState === statesMassive.mainState) {
                        if (document.getElementById(photoPost.id) === null) {
                            if (view.isSatisfyingFilter(photoPost)) {
                                view.addPostToDom(photoPost);
                            }
                        }
                    }
                }
                longPollingControl();
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
}();