

var dom = function() {
    var latestSkip = 0;       //Данное поле хранит количество записей, которое нужно было пропустить в последний раз 
    var latestTop = 0;        //Данное поле хранит количество записей, которое нужно было вывести на экран в последний раз
    var latestFilterConfig;   //Данный объект хранит параметры фильтрации, которые были применены в последний раз
    var currentName = '';     //Хранит текущий ник пользователя

    function addLike(id)
    {
        if (currentName === '') {
            return;
        }
        if (typeof(id) !== 'string') {
            return;
        }
        /*for (let index = 0; index < module.getPhotoPost(id).likes.length; index++) {
            if (module.getPhotoPost(id).likes[index] === currentName) {
                module.getPhotoPost(id).likes.splice(index, 1);

                var post = document.getElementById(id);
                var amountOfLikes = post.getElementsByTagName('span')[0];
                amountOfLikes.innerHTML = module.getPhotoPost(id).likes.length;

                return;
            }   
        }*/

        if(!module.getPhotoPost(id).likes.every(function(like, index) {
            if (like === currentName) {
                module.getPhotoPost(id).likes.splice(index, 1);

                var post = document.getElementById(id);
                if (post !== null) {
                    var amountOfLikes = post.getElementsByTagName('span')[0];
                    amountOfLikes.innerHTML = module.getPhotoPost(id).likes.length;   
                }
                return false;
            }
            return true;
        })) {
            return;
        }

        module.getPhotoPost(id).likes.push(currentName);

        var post = document.getElementById(id);
        if (post !== null) {
            var amountOfLikes = post.getElementsByTagName('span')[0];
            amountOfLikes.innerHTML = module.getPhotoPost(id).likes.length;   
        }
    }

    var hashtags = [];
    function findUniqueHashtags() {
        for (let index = 0; index < photoPosts.length; index++) {
            for (let index2 = 0; index2 < photoPosts[index].hashtags.length; index2++) {
                if (hashtags.every(item => item !== photoPosts[index].hashtags[index2])) {
                    hashtags.push(photoPosts[index].hashtags[index2]);
                }
            }
        }
    }

    var authorNames = [];
    function findUniqueNames() {
        for (let index = 0; index < photoPosts.length; index++) {
            if (authorNames.every(item => item !== photoPosts[index].author)) {
                authorNames.push(photoPosts[index].author);
            }
        }
    }

    function showHashtags() {
        var elem = document.getElementById('filterselectors');
        elem.innerHTML = '';
        findUniqueHashtags();
        for (let index = 0; index < hashtags.length && index < 10; index++) {
            var option = document.createElement('option');
            option.innerHTML = hashtags[index];
            elem.appendChild(option);
        }
    }

    function showAuthors() {
        var elem = document.getElementById('authorselectors');
        elem.innerHTML = '';
        findUniqueNames();
        for (let index = 0; index < authorNames.length && index < 10; index++) {
            var option = document.createElement('option');
            option.innerHTML = authorNames[index];
            elem.appendChild(option);
        }
    }

    function checkLogin(username) {
        var islogined = (username !== undefined);
        if(islogined)
        {
            document.getElementsByClassName('nicknamealign')[0].innerHTML = '<p>' + username + '</p>';
            document.getElementsByClassName('headeralign')[0].innerHTML = '<button type="button" class="buttonusual">' +
            'Add photo</button>' +
            '<button type="button" class="buttonusual">Exit</button>';
            currentName = username;
        }
        else
        {
            document.getElementsByClassName('nicknamealign')[0].innerHTML = '';
            document.getElementsByClassName('headeralign')[0].innerHTML = '<button type="button" class="buttonusual">Login</button>';
            username = '';
        }
    }

    function showPhotopost(photopost) {
        var main = document.getElementsByClassName('mainplacing')[0];

        var temp = document.createElement('template');
        
        var post = document.createElement('div');
        post.className = 'post';
        post.id = photopost.id;
        
        var photo = document.createElement('div');
        photo.className = 'photo';
        photo.innerHTML = '<img class="imgstyle" src="' + photopost.photolink + '" alt="Mat">';
        
        var nick = document.createElement('div');
        nick.className = 'nickandicons';
        nick.innerHTML = photopost.author;

        var icons = document.createElement('div');
        icons.className = 'nickandicons';
        icons.innerHTML = 
        '<button type="button" class="buttonset"><img class="iconstyles" src="../ImagesAndIcons/delete-512.png" alt="Bin"></button>' +
        '<button type="button" class="buttonset"><img class="iconstyles" src="../ImagesAndIcons/221649.png" alt="Edit"></button>' +
        '<button type="button" class="buttonset"><img class="iconstyles" src="../ImagesAndIcons/comments.png" alt="Bin"></button>' +
        '<button type="button" class="buttonset"><img class="iconstyles" src="../ImagesAndIcons/filled-like.png" alt="Bin">' + 
        '<span>' + photopost.likes.length + '</span>' + '</button>';
        
        var date = document.createElement('div');
        date.className = 'date';
        date.innerHTML = getformatDate(photopost);

        //Объявление элементов завершено, приступаем к связыванию и добавлению в дерево

        post.appendChild(photo);
        post.appendChild(nick);
        post.appendChild(icons);
        post.appendChild(date);

        temp.content.appendChild(post);

        main.appendChild(temp.content);
    }

    function getformatDate(post) {
        var date = post.createdAt;

        var day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }

        var month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }

        var year = date.getFullYear();

        return day + '.' + month + '.' + year;
    }

    function addPhotopost(photopost) {
        if(module.addPhotoPost(photopost))
        {
            showPosts(latestSkip, latestTop, latestFilterConfig);
        }
    }

    function deletephotopost(id) {
        var goalPost = module.getPhotoPost(id);
        if (goalPost === undefined) {
            return false;
        }
        if (currentName !== goalPost.author) {
            return false;
        }
        if(module.removePhotoPost(id))
        {
            showPosts(latestSkip, latestTop, latestFilterConfig);
        }
    }

    function editPost(id, photoPost) {
        var goalPost = module.getPhotoPost(id);
        if (goalPost === undefined) {
            return false;
        }
        if (currentName !== goalPost.author) {
            return false;
        }
        if(module.editPhotoPost(id, photoPost))
        {
            showPosts(latestSkip, latestTop, latestFilterConfig);
        }
        return true;
    }

    function showPosts(skip, top, filterConfig) {
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        var photoPosts = module.getPhotoPosts(skip, top, filterConfig);
    
        if (photoPosts === undefined) {
            return;
        }
    
        for (var i = 0; i < photoPosts.length; i++)
        {
            showPhotopost(photoPosts[i]);
        }
        latestSkip = skip;
        latestTop = top;
        latestFilterConfig = filterConfig;
    }

    return {
        showPhotopost: showPhotopost,
        checkLogin: checkLogin,
        addPhotopost: addPhotopost,
        deletePhotopost: deletephotopost,
        editPost: editPost,
        showHashtags: showHashtags,
        showPosts: showPosts,
        showAuthors: showAuthors,
        addLike: addLike
    }
}();

//Отображаение первых 10 постов
dom.showPosts(0, 10);

//Редактирование
dom.editPost('9', {description: 'Hello, world!!!', photolink: '../ImagesAndIcons/tmp852896240201891842.jpg', likes: ['Vasia', 'Kolia'], hashtags: ['#2018', 'wronghash', '#NewYear']});

//Вывод тегов
dom.showHashtags();

//Вывод авторов
dom.showAuthors();

//Удаление фотопоста с id = 9
dom.deletePhotopost('9');

//Добавление нового фотопоста с id = 9
dom.addPhotopost(new Photopost('9', 'description20', new Date('2018-03-16T02:20:00'), 'Kolia', '../ImagesAndIcons/1477469601_nature_gora.jpg', ['Vasia', 'Petia'], ['#summer', '#2018']));

//Логин
dom.checkLogin('User123456');

//Ставим лайк посту с ID = 9
dom.addLike('9');

//Убираем лайк всё тому же посту с ID = 9
dom.addLike('9');