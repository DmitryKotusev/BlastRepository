'use strict';
function Photopost(id, description, createdAt, author, photolink, likes, hashtags, isDeleted) {
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
    this.likes = likes || [];
    this.hashtags = hashtags || [];
    if (typeof(isDeleted) === 'boolean') {
        this.isDeleted = isDeleted;   
    }
    else
    {
        this.isDeleted = false;
    }
}
var photoPosts = [
    new Photopost('1', 'description1', new Date('2018-02-26T23:00:00'), 'Vasia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia', 'Kolia', 'Anatolij'], ['#cool', '#2018']),
    new Photopost('2', 'description2', new Date('2018-02-26T23:00:00'), 'Vova', '../ImagesAndIcons/1477469507_autumn-panorama.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('3', 'description3', new Date('2018-02-26T23:00:00'), 'Petia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('4', 'description4', new Date('2018-02-26T23:00:00'), 'Dima', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2019']),
    new Photopost('5', 'description5', new Date('2018-01-18T12:33:50'), 'Vasia', '../ImagesAndIcons/priroda-new-zeland-4.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('6', 'description6', new Date('2018-02-26T23:00:00'), 'Vasia', '../ImagesAndIcons/tmp852896240201891842.jpg', ['Vasia', 'Petia'], ['#cool', '#2017']),
    new Photopost('7', 'description7', new Date('2018-02-26T23:00:00'), 'Dima', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('8', 'description8', new Date('2018-03-14T15:00:09'), 'Dima', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia', 'Dima'], ['#cool', '#2016']),
    new Photopost('9', 'description9', new Date('2018-03-14T22:10:00'), 'Vasia', '../ImagesAndIcons/1477469601_nature_gora.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('10', 'description10', new Date('2018-02-26T23:00:00'), 'Vasia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('11', 'description11', new Date('2018-02-26T23:00:00'), 'Vasia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('12', 'description12', new Date('2018-02-23T23:00:00'), 'Dima', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia', 'Katia', 'Dima', 'Anatolij'], ['#cool', '#2018']),
    new Photopost('13', 'description13', new Date('2017-10-11T23:07:11'), 'Kolia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('14', 'description14', new Date('2018-02-26T23:00:00'), 'Vova', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('15', 'description15', new Date('2018-02-26T23:00:00'), 'Vasia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool']),
    new Photopost('16', 'description16', new Date('2018-02-26T23:00:00'), 'Vasia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('17', 'description17', new Date('2018-02-26T23:00:00'), 'Anastasia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('18', 'description18', new Date('2018-02-28T12:32:01'), 'Vasia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('19', 'description19', new Date('2018-02-26T23:00:00'), 'Magamed', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('20', 'description20', new Date('2018-03-14T16:20:00'), 'Vasia', '../ImagesAndIcons/Mat.jpg', ['Vasia', 'Petia'], ['#cool', '#2018'])
]

function user (login, password){
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

let module = (function () {
    function clone(params) {
        var clone = {}; // новый пустой объект

        // скопируем в него все свойства params
        for (var key in params) {
            clone[key] = params[key];
        }
        return clone;
    }
    function datesort(a, b) {
        var dif = b.createdAt - a.createdAt;
        if (dif > 0) {
            return 1;
        }
        if (dif < 0) {
            return -1;
        }
        return 0;
    }
    function validhash(item) {
        if (typeof (item) !== 'string') {
            return false;
        }
        if (item.charAt(0) !== '#') {
            return false;
        }
        for (let index = 1; index < item.length; index++) {
            if (item.charAt(index) === ' ') {
                return false;
            }
        }
        return true;
    }
    function getPhotoPosts(skip, top, filterConfig) {
        skip = skip || 0;
        if (typeof (skip) !== 'number') {
            skip = 0;
        }

        top = top || 10;
        if (typeof (top) !== 'number') {
            top = 10;
        }

        photoPosts.sort(datesort);
        
        if (filterConfig !== undefined) {
            //Функция фильтрации
            function filtfunc(param) {
                if (param.isDeleted === true) {
                    return false;
                }

                if (filterConfig.author !== undefined) {
                    if (typeof (filterConfig.author) === 'string') {
                        if (filterConfig.author !== param.author) {
                            return false;
                        }
                    }
                }
                if (filterConfig.createdAt !== undefined) {
                    if (typeof (filterConfig.createdAt) === 'object') {
                        if (filterConfig.createdAt.getFullYear() !== param.createdAt.getFullYear() || filterConfig.createdAt.getMonth() !== param.createdAt.getMonth() || filterConfig.createdAt.getDate() !== param.createdAt.getDate()) {
                            return false;
                        }
                    }
                }
                if (filterConfig.hashtags !== undefined) {
                    if (typeof (filterConfig.hashtags) === 'object') {
                        for (var index = 0; index < filterConfig.hashtags.length; index++) {
                            var flag = false;
                            for (var index2 = 0; index2 < param.hashtags.length; index2++) {
                                if (param.hashtags[index2] === filterConfig.hashtags[index]) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                return false;
                            }
                        }
                    }
                }
                //////////
                return true;
            }
            var buffmass = photoPosts.filter(filtfunc);//фильтрация
        }
        else 
        {
            var buffmass = photoPosts.filter(el => {
                if (el.isDeleted === true) {
                    return false;
                }
                return true;
            });//Фильтрация нужна только для удалённых элементов
        }
        
        return buffmass.slice(skip, skip + top);//отбрасывание первых skip элементов массива и взятие последующих top элементов
    }
    function getPhotoPost(id) {
        for (var index = 0; index < photoPosts.length; index++) {
            if (photoPosts[index].id === id && !photoPosts[index].isDeleted) {
                return photoPosts[index];
            }
        };
    }
    function validatePhotoPost(photoPost) {
        if (typeof (photoPost.id) !== 'string' || typeof (photoPost.description) !== 'string' || typeof (photoPost.author) !== 'string' || typeof (photoPost.photolink) !== 'string') {
            return false;
        }
        if (photoPost.description.length >= 200) {
            return false;
        }
        if (photoPost.createdAt === 'Invalid Date') {
            return false;
        }
        if (!(Array.isArray(photoPost.likes))) {
            return false;
        }
        if (!(Array.isArray(photoPost.hashtags))) {
            return false;
        }
        function isString(item) {
            return (typeof (item) === 'string');
        }
        if (!photoPost.hashtags.every(validhash)) {
            return false;
        }
        if (!photoPost.hashtags.every(isString)) {
            return false;
        }
        if (!photoPosts.every(item => item.id !== photoPost.id)) {
            return false;
        }
        
        return true;
    }
    function addPhotoPost(photoPost) {
        if (validatePhotoPost(photoPost)) {
            photoPosts.push(photoPost);
            return true;
        }
        return false;
    }
    function editPhotoPost(id, photoPost) {
        if (typeof (id) !== 'string') {
            return false;
        }
        if (photoPost === undefined) {
            return false;
        }
        var i;
        for (var index = 0; index < photoPosts.length; index++) {
            if (photoPosts[index].id === id) {
                i = index;
                break;
            }
        }
        if (i === undefined) {
            return false;
        }
        var buff = clone(photoPosts[i]);
        if (photoPost.description !== undefined && typeof (photoPost.description) === 'string') {
            buff.description = photoPost.description;
        }
        if (photoPost.photolink !== undefined && typeof (photoPost.photolink) === 'string') {
            buff.photolink = photoPost.photolink;
        }
        if ((Array.isArray(photoPost.likes))) {
            for (var index = 0; index < photoPost.likes.length; index++) {
                var flag = false;
                for (var index2 = 0; index2 < buff.likes.length; index2++) {
                    if (photoPost.likes[index] === buff.likes[index2]) {
                        buff.likes.splice(index2, 1);
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    buff.likes.push(photoPost.likes[index]);
                }
            }
        }
        if ((Array.isArray(photoPost.hashtags))) {
            for (var index = 0; index < photoPost.hashtags.length; index++) {
                if (validhash(photoPost.hashtags[index])) {
                    var flag = false;
                    for (var index2 = 0; index2 < buff.hashtags.length; index2++) {
                        if (photoPost.hashtags[index] === buff.hashtags[index2]) {
                            buff.hashtags.splice(index2, 1);
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        buff.hashtags.push(photoPost.hashtags[index]);
                    }
                }
            }
        }
        photoPosts[i] = clone(buff);
        return true;
    }
    function removePhotoPost(id) {
        if (typeof (id) === 'string') {
            for (var index = 0; index < photoPosts.length; index++) {
                if (photoPosts[index].id === id) {
                    //photoPosts.splice(index, 1);
                    photoPosts[index].isDeleted = true;
                    return true;
                }
            }
        }
        return false;
    }
    return {
        removePhotoPost: removePhotoPost,
        editPhotoPost: editPhotoPost,
        addPhotoPost: addPhotoPost,
        validatePhotoPost: validatePhotoPost,
        getPhotoPost: getPhotoPost,
        getPhotoPosts: getPhotoPosts,
        validhash: validhash
    }
    /////////////////////Проверки//////////////////////////////////////////////////////////////////////
}());
/*console.log(module.getPhotoPosts(0, 10));
var ob = module.getPhotoPost('4');
console.log(ob);
var ob1 = new Photopost('20', 'description20', new Date('2018-03-14T16:20:00'), 'Vasia', 'link', ['Vasia', 'Petia'], ['#cool', '#2018']);
console.log(ob1);
console.log(module.validatePhotoPost(ob1));*/
/*console.log(getPhotoPosts(0, 10));
console.log(getPhotoPosts(0, 10, {author: 'Dima', hashtags: ['#2018'], createdAt: new Date(2018, 1, 26)}));
console.log(removePhotoPost('3'));
console.log(removePhotoPost(5));

console.log(addPhotoPost(new Photopost('3', 'description20', new Date('2016-03-16T02:20:00'), 'Kolia', 'link', ['Vasia', 'Petia'], ['#summer', '#2018'])));
console.log(photoPosts);
console.log(getPhotoPosts(0, 21));*/
/*console.log(photoPosts[10]);
module.editPhotoPost('2', {description: 'Hello, world!!!', photolink: 'newphotolink', likes: ['Vasia', 'Kolia'], hashtags: ['#2018', 'wronghash', '#NewYear']});
console.log(photoPosts[10]);*/
   