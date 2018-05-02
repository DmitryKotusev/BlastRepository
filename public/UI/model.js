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
                    reject(xhr.responseText);
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
                    reject(xhr.responseText);
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

            var result = false;

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                    result = false;
                }
                else {
                    console.log(xhr.responseText);
                    result = true;
                }
            }

            xhr.send(JSON.stringify(photoPost));
        });
    }

    function removePhotoPost(id) {
        if (id === undefined) {
            return false;
        }

        var xhr = new XMLHttpRequest();

        xhr.open('DELETE', `removePhotoPost/${id}`, false);

        var result = false;

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                result = false;
            }
            else {
                console.log(xhr.responseText);
                result = true;
            }
        }

        xhr.send();

        return result;
    }

    function editPhotoPost(id, photoPost) {
        var xhr = new XMLHttpRequest();

        if (id === undefined) {
            return false;
        }

        if (photoPost === undefined) {
            return false;
        }

        xhr.open('PUT', `editPhotoPost/${id}`, false);

        xhr.setRequestHeader('Content-Type', 'application/json');

        var result = false;

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
                result = false;
            }
            else {
                console.log(xhr.responseText);
                result = true;
            }
        }

        xhr.send(JSON.stringify(photoPost));

        return result;
    }

    function findUniqueHashtags() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', `findUniqueHashtags`, false);

        var hashtags;

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
            }
            else {
                hashtags = JSON.parse(xhr.responseText);
            }
        }

        xhr.send();

        return hashtags;
    }

    function findUniqueNames() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', `findUniqueNames`, false);

        var names;

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
            }
            else {
                names = JSON.parse(xhr.responseText);
            }
        }

        xhr.send();

        return names;
    }

    function downloadFile(file) {
        if (file === null || file === undefined) {
            return null;
        }

        var xhr = new XMLHttpRequest();

        xhr.open('POST', `downloadFile`, false);
        //xhr.setRequestHeader('Content-Type', 'multipart/form-data');

        var formData = new FormData();
        formData.append('file', file);

        var fileName = null;
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
            }
            else {
                fileName = JSON.parse(xhr.responseText);
            }
        }

        xhr.send(formData);

        return fileName;
    }

    function longPollingControl() {
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