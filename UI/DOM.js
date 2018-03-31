var currentName = '';     //Хранит текущий ник пользователя
var currentState = 0;     //Отражает текущее состояние страницы

var dom = function() {
    var latestSkip = 0;       //Данное поле хранит количество записей, которое нужно было пропустить в последний раз 
    var latestTop = 0;        //Данное поле хранит количество записей, которое нужно было вывести на экран в последний раз
    var latestFilterConfig;   //Данный объект хранит параметры фильтрации, которые были применены в последний раз

    //Возвращает непривязанную к DOM кнопку загрузки
    function makeLoadMoreButton(params) {
        //<button type="button" class="buttonusualadd">Load more</button>
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'buttonusualadd';
        button.innerHTML = 'Load more';
        button.addEventListener('click', eve.addMore);
        return button;
    }

    //Возвращает непривязанную к DOM кнопку подтверждения изменений
    function makeSaveButton(params) {
        //<button type="button" class="buttonusualadd">Load more</button>
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'buttonusualadd';
        button.innerHTML = 'Save changes';
        //button.addEventListener('click', eve.addMore);
        return button;
    }

    function makeUploadButton(params) {
        //<button type="button" class="buttonusualadd">Load more</button>
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'buttonusualadd';
        button.innerHTML = 'Save and upload';
        //button.addEventListener('click', eve.addMore);
        return button;
    }

    //Возращает непривязанный к DOM фильтр
    function makeFilter() {
        let filt = document.createElement('aside');
        filt.innerHTML = 
        `<div class="filterelements">
            <div class="filtermainbutton">
                <button type="button" class="buttonusual">Filter</button>
            </div>

            <form class="asideform">
                <div class="filtercontent">
                    <p class="filtertext">
                        <input name="authorcheck" class="inputcheckbox" type="checkbox" checked>Author</p>
                    <input type="text" name="author" list="authorselectors">
                    <datalist id="authorselectors">
                        <option>VasiaPupkin</option>
                        <option>Kolia</option>
                    </datalist>

                </div>

                <div class="filtercontent">
                    <p class="filtertext">
                        <input name="hashtagcheck" class="inputcheckbox" type="checkbox" checked>Hashtags</p>
                    <input type="text" name="hashtag" list="filterselectors">
                    <datalist id="filterselectors">
                        <option>#2K18</option>
                        <option>#Luka</option>
                        <option>#VR</option>
                        <option>#Olypmics</option>
                    </datalist>
                

                </div>
                <div class="filtercontent">
                    <p class="filtertext">
                        <input name="datecheck" class="inputcheckbox" type="checkbox" checked>Date</p>
                    <input type="text" name="day" maxlength="2" class="inputdate" placeholder="dd">
                    <span>/</span>
                    <input type="text" name="month" maxlength="2" class="inputdate" placeholder="mm">
                    <span>/</span>
                    <input type="text" name="year" maxlength="4" class="inputyear" placeholder="yyyy">
                </div>
            </form>
        </div>`;
        filt.getElementsByClassName('buttonusual')[0].addEventListener('click', eve.filter);
        return filt;
    }

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

        if (module.getPhotoPost(id) === undefined) {
            return;
        }

        if(!module.getPhotoPost(id).likes.every(function(like, index) {
            if (like === currentName) {
                module.getPhotoPost(id).likes.splice(index, 1);

                var post = document.getElementById(id);
                if (post !== null) {
                    var amountOfLikes = post.getElementsByClassName('likesamount')[0];
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
            var amountOfLikes = post.getElementsByClassName('likesamount')[0];
            amountOfLikes.innerHTML = module.getPhotoPost(id).likes.length;   
        }
    }

    

    var hashtags = [];
    function findUniqueHashtags() {
        for (let i = 0; i < photoPosts.length; i++) {
            for (let j = 0; j < photoPosts[i].hashtags.length; j++) {
                if (hashtags.every(item => item !== photoPosts[i].hashtags[j])) {
                    hashtags.push(photoPosts[i].hashtags[j]);
                }
            }
        }
    }

    var authorNames = [];
    function findUniqueNames() {
        for (let i = 0; i < photoPosts.length; i++) {
            if (authorNames.every(item => item !== photoPosts[i].author)) {
                authorNames.push(photoPosts[i].author);
            }
        }
    }

    function showHashtags() {
        var elem = document.getElementById('filterselectors');
        elem.innerHTML = '';
        findUniqueHashtags();
        for (let i = 0; i < hashtags.length && i < 10; i++) {
            var option = document.createElement('option');
            option.innerHTML = hashtags[i];
            elem.appendChild(option);
        }
    }

    function showAuthors() {
        var elem = document.getElementById('authorselectors');
        elem.innerHTML = '';
        findUniqueNames();
        for (let i = 0; i < authorNames.length && i < 10; i++) {
            var option = document.createElement('option');
            option.innerHTML = authorNames[i];
            elem.appendChild(option);
        }
    }

    function checkLogin(username) {
        if (username === '') {
            username = undefined;
        }
        if (username === currentName) {
            return;
        }
        var islogined = (username !== undefined);
        if(islogined)
        {
            document.getElementsByClassName('nicknamealign')[0].innerHTML = `<p> ${username} </p>`;
            document.getElementsByClassName('headeralign')[0].innerHTML = 
            `<button type="button" class="buttonusual">
            Add photo</button>
            <button type="button" class="buttonusual">Exit</button>`;
            currentName = username;

            let exitButton = document.getElementsByClassName('headeralign')[0].getElementsByTagName('button')[1];
            exitButton.addEventListener('click', eve.exit);

            let addPhotoButton = document.getElementsByClassName('headeralign')[0].getElementsByTagName('button')[0];
            addPhotoButton.addEventListener('click', eve.uploadPost);
        }
        else
        {
            document.getElementsByClassName('nicknamealign')[0].innerHTML = '';
            document.getElementsByClassName('headeralign')[0].innerHTML = `<button type="button" class="buttonusual">Login</button>`;
            currentName = '';
            var header = document.getElementsByClassName('headeralign')[0];
            var but = header.getElementsByTagName('button')[0];
            but.addEventListener('click', eve.login);
        }
        if (currentState === 0) {
            showPosts(0, 10);//Поменял параметры фильтра   
        }
        if (currentState === 3) {
            showPosts(0, 10);
            let filt = dom.makeFilter();
            document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
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
        photo.innerHTML = `<img class="imgstyle" src="${photopost.photolink}" alt="Mat">`;
        
        var nick = document.createElement('div');
        nick.className = 'nickandicons';
        nick.innerHTML = photopost.author;

        var icons = document.createElement('div');
        icons.className = 'nickandicons';
        if (currentName === photopost.author) {
            icons.innerHTML = 
            `<button type="button" class="buttonset"><img class="iconstyles" src="../ImagesAndIcons/delete-512.png" alt="Bin"></button>
            <button type="button" class="buttonset"><a href="#top"><img class="iconstyles" src="../ImagesAndIcons/221649.png" alt="Edit"></a></button>
            <button type="button" class="buttonset"><a href="#top"><img class="iconstyles" src="../ImagesAndIcons/comments.png" alt="Bin"></a></button>
            <button type="button" class="buttonset"><img class="iconstyles" src="../ImagesAndIcons/filled-like.png" alt="Bin"> 
            <span class="likesamount">${photopost.likes.length}</span></button>`;

            let likes = icons.getElementsByTagName('button')[3];
            likes.addEventListener('click', eve.like);
            
            let look = icons.getElementsByTagName('button')[2];
            look.addEventListener('click', eve.lookAtPhoto);

            let edit = icons.getElementsByTagName('button')[1];
            edit.addEventListener('click', eve.editPost);

            let del = icons.getElementsByTagName('button')[0];
            del.addEventListener('click', eve.deletePost);
        }
        else
        {
            icons.innerHTML = 
            `<button type="button" class="buttonset"><a href="#top"><img class="iconstyles" src="../ImagesAndIcons/comments.png" alt="Bin"></a></button>
            <button type="button" class="buttonset"><img class="iconstyles" src="../ImagesAndIcons/filled-like.png" alt="Bin"> 
            <span class="likesamount">${photopost.likes.length}</span></button>`;

            let likes = icons.getElementsByTagName('button')[1];
            likes.addEventListener('click', eve.like);
            let look = icons.getElementsByTagName('button')[0];
            look.addEventListener('click', eve.lookAtPhoto);
        }
        
        var date = document.createElement('div');
        date.className = 'date';
        date.innerHTML = photopost.createdAt.toLocaleDateString();

        //Объявление элементов завершено, приступаем к связыванию и добавлению в дерево

        post.appendChild(photo);
        post.appendChild(nick);
        post.appendChild(icons);
        post.appendChild(date);

        temp.content.appendChild(post);

        main.appendChild(temp.content);
    }

    /*function getformatDate(post) {
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
    }*/

    function addPhotopost(photopost) {
        if(module.addPhotoPost(photopost))
        {
            showPosts(0, 10);//Поменял параметры фильтра
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
            showPosts(0, 10);//Поменял параметры фильтра
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
            showPosts(0, 10);//Поменял параметры фильтра
        }
        return true;
    }

    function showPosts(skip, top, filterConfig) {
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        document.getElementsByClassName('mainplacing')[1].innerHTML = `<button type="button" 
        class="buttonusualadd">Load more</button>`;

        var photoPosts = module.getPhotoPosts(skip, top, filterConfig);
    
        if (photoPosts === undefined) {
            return;
        }

        photoPosts.forEach(function (photopost) {
            showPhotopost(photopost);
        });
        
        latestSkip = skip;
        latestTop = top;
        latestFilterConfig = filterConfig;
        if (module.getPhotoPosts(skip, top, filterConfig).length === 0) {
            document.getElementsByClassName('mainplacing')[1].innerHTML = '';
            return;
        }

        var loadMorButton = document.getElementsByClassName('mainplacing')[1].getElementsByTagName('button')[0];
        loadMorButton.addEventListener('click', eve.addMore);
        if (module.getPhotoPosts(latestSkip + 10, latestTop, latestFilterConfig).length === 0) {
            document.getElementsByClassName('mainplacing')[1].innerHTML = '';
        }
    }

    function addMorePosts() {
        latestSkip = latestSkip + 10;

        var photoPosts = module.getPhotoPosts(latestSkip, latestTop, latestFilterConfig);
    
        if (photoPosts === undefined) {
            return;
        }

        photoPosts.forEach(function (photopost) {
            showPhotopost(photopost);
        });

        if (module.getPhotoPosts(latestSkip + 10, latestTop, latestFilterConfig).length === 0) {
            document.getElementsByClassName('mainplacing')[1].innerHTML = '';
        }
    }

    function startPageDownload(params) {
        //Отображаение первых 10 постов
        dom.showPosts(0, 10);

        dom.checkLogin(currentName);

        let header = document.getElementsByTagName('main')[0];

        let body = document.getElementsByTagName('body')[0];

        body.insertBefore(dom.makeFilter(), header);

        document.getElementsByClassName('mainplacing')[1].getElementsByTagName('button')[0].addEventListener('click', eve.addMore);

        document.getElementsByTagName('aside')[0].getElementsByClassName('buttonusual')[0].addEventListener('click', eve.filter);

        //Вывод тегов
        dom.showHashtags();

        //Вывод авторов
        dom.showAuthors();
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
        addLike: addLike,
        addMorePosts: addMorePosts,
        makeFilter: makeFilter,
        makeLoadMoreButton: makeLoadMoreButton,
        makeSaveButton: makeSaveButton,
        makeUploadButton: makeUploadButton,
        startPageDownload: startPageDownload
    }
}();

dom.startPageDownload();
/*
//Редактирование
dom.editPost('9', {description: 'Hello, world!!!', photolink: '../ImagesAndIcons/tmp852896240201891842.jpg', likes: ['Vasia', 'Kolia'], hashtags: ['#2018', 'wronghash', '#NewYear']});

//Удаление фотопоста с id = 9
dom.deletePhotopost('9');

//Добавление нового фотопоста с id = 9
dom.addPhotopost(new Photopost('9', 'description20', new Date('2018-03-16T02:20:00'), 'Kolia', '../ImagesAndIcons/1477469601_nature_gora.jpg', ['Vasia', 'Petia'], ['#summer', '#2018']));

//Логин
dom.checkLogin('Vasia');

//Ставим лайк посту с ID = 9
dom.addLike('9');

//Убираем лайк всё тому же посту с ID = 9
dom.addLike('9');

dom.checkLogin();*/