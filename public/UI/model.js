'use strict';

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
                console.log(xhr.status + ': ' + xhr.statusText);
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

    return {
        getPhotoPosts: getPhotoPosts
    }
}();