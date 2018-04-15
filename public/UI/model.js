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

let model = function () {
    function getPhotoPosts(skip, top, filterConfig) {
        var xhr = new XMLHttpRequest();

        if (skip === undefined) {
            skip = 0;
        }

        if (top === undefined) {
            top = 10;
        }

        xhr.open('POST', `getPhotoPosts?skip=${skip}&top=${top}`, false);

        xhr.setRequestHeader('Content-Type', 'application/json');

        var photoPosts;

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
            }
            else {
                photoPosts = JSON.parse(xhr.responseText);
            }
        }

        if (filterConfig !== undefined) {
            xhr.send(JSON.stringify(filterConfig));
        }
        else {
            xhr.send();
        }

        return photoPosts;
    }

    function getPhotoPost(id) {
        if (id === undefined) {
            return;
        }

        var xhr = new XMLHttpRequest();

        xhr.open('GET', `getPhotoPost/${id}`, false);

        var photoPost;

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
            }
            else {
                photoPost = JSON.parse(xhr.responseText);
            }
        }

        xhr.send();

        return photoPost;
    }

    function addPhotoPost(photoPost) {
        var xhr = new XMLHttpRequest();

        if (photoPost === undefined) {
            return false;
        }

        xhr.open('POST', `addPhotoPost`, false);

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

    return {
        getPhotoPosts: getPhotoPosts,
        getPhotoPost: getPhotoPost,
        addPhotoPost: addPhotoPost,
        removePhotoPost: removePhotoPost
    }
}();