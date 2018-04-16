var currentName;     //Хранит текущий ник пользователя
var currentState = 0;     //Отражает текущее состояние страницы


var statesMassive = {
    mainState: 0,      //Главная страница
    loginState: 1,      //Страница в формой для логина
    lookAtPhotoState: 2,//Страница для просмотра фота
    editPostState: 3,   //Страница редактирования фотопоста
    uploadPostState: 4  //Страница добавления нового фото
};

var latestSkip = 0;       //Данное поле хранит количество записей, которое нужно было пропустить в последний раз 
var latestTop = 10;        //Данное поле хранит количество записей, которое нужно было вывести на экран в последний раз
var latestFilterConfig;   //Данный объект хранит параметры фильтрации, которые были применены в последний раз

var dom = function () {
    function backButtonRestructure(event) {
        let main = document.getElementsByClassName('mainplacing')[0];
        main.innerHTML = '';
        let filt = dom.makeFilter();
        document.getElementsByTagName('body')[0].replaceChild(filt, event.target);
        dom.showPosts(0, 10);
        if (currentName !== null && currentName !== '') {
            dom.checkLogin(currentName);
        }
        else {
            dom.checkLogin();
        }
        dom.showAuthors();
        dom.showHashtags();
        currentState = statesMassive.mainState;
    }

    function loginRestructure(event) {
        currentState = statesMassive.loginState;//Состояние логина
        document.getElementsByClassName('nicknamealign')[0].innerHTML = '';
        document.getElementsByClassName('headeralign')[0].innerHTML = '';
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        document.getElementsByClassName('mainplacing')[1].innerHTML = '';
        /////
        let body = document.getElementsByTagName('body')[0];
        let filt = body.getElementsByTagName('aside')[0];

        if (filt !== undefined) {
            let backButton = document.createElement('button');
            backButton.type = 'button';
            backButton.className = 'buttonback';
            backButton.id = 'Back';
            backButton.innerHTML = 'Back';
            backButton.addEventListener('click', eve.backButtonEvent);

            body.replaceChild(backButton, filt);
        }
        //////
        let main = document.getElementsByClassName('mainplacing')[0];
        main.innerHTML =
            `<div id="form_login_container">
            <p class="login-text">Enter your login and password</p>
            <p class="error-text"></p>
            <form method='POST'>
            <input type="text" placeholder="Login" class="text_input" />
            <input type="text" placeholder="Password" class="text_input" />
            <button type="button" class="buttonlogin">Login</button>
            </form>
        </div>`;
    }

    function pressLoginRestructure(event) {
        let loginInfo = document.getElementsByClassName('mainplacing')[0].getElementsByTagName('input')[0];
        let passwordInfo = document.getElementsByClassName('mainplacing')[0].getElementsByTagName('input')[1];
        for (let index = 0; index < users.length; index++) {
            if (users[index].login === loginInfo.value && users[index].password === passwordInfo.value) {
                let main = document.getElementsByClassName('mainplacing')[0];
                main.innerHTML = '';
                let filt = dom.makeFilter();
                document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
                dom.checkLogin(users[index].login);
                dom.showPosts(0, 10);
                dom.showAuthors();
                dom.showHashtags();
                currentState = statesMassive.mainState;
                return;
            }
        }

        //Вывод ошибки
        let errorText = document.getElementsByClassName('mainplacing')[0].getElementsByTagName('p')[1];
        errorText.innerHTML = 'Error, invalid login or password';
    }

    function lookAtPhotoRestructure(event) {
        currentState = statesMassive.lookAtPhotoState; //Состояние просмотра фотографии
        let post = module.getPhotoPost(event.target.closest('.post').id);
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        //let loadMoresect = document.getElementsByClassName('mainplacing')[1];
        document.getElementsByClassName('mainplacing')[1].innerHTML = '';
        let main = document.getElementsByTagName('main')[0];
        //main.removeChild(loadMoresect);

        let body = document.getElementsByTagName('body')[0];
        let filt = body.getElementsByTagName('aside')[0];

        let backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'buttonback';
        backButton.id = 'Back';
        backButton.innerHTML = 'Back';
        backButton.addEventListener('click', eve.backButtonEvent);

        body.replaceChild(backButton, filt);

        mainPlacing = document.getElementsByClassName('mainplacing')[0];


        if (currentName === module.getPhotoPost(event.target.closest('.post').id).author) {
            mainPlacing.innerHTML =
                `<div class="lookatphoto" id="${post.id}">
                <div class="bigphoto">
                    <img class="imgstyle" src="${post.photolink}" alt="Mat">
                </div>
                <p class="lookatphototext">Description</p>
                <textarea class="texttoread" readonly name="description" id="" cols="35" rows="5">${post.description}</textarea>
                <p class="lookatphototext">Hashtags</p>
                <textarea class="hashtagstoread" readonly name="hashtags" id="" cols="35" rows="5">${post.hashtags.join(' ')}</textarea>
                <p class="lookatphototext">Author: ${post.author}</p>
                <div class="lookatphotoicons">
                    <p class="lookatphototext">Date: ${post.createdAt.toLocaleDateString()}</p>
                    <div class="nickandiconsspec">
                        <button type="button" class="buttonsetspec"><img class="iconstyles" src="./ImagesAndIcons/delete-512.png" alt="Bin"></button>
                        <button type="button" class="buttonsetspec"><img class="iconstyles" src="./ImagesAndIcons/221649.png" alt="Edit"></button>
                        <button type="button" class="buttonsetspec"><img class="iconstyles" src="./ImagesAndIcons/filled-like.png" alt="Bin">
                        <span class="likesamount">${post.likes.length}</span></button>
                    </div>
                </div>
            </div>`;

            return true;
        }

        mainPlacing.innerHTML =
            `<div class="lookatphoto" id="${post.id}">
            <div class="bigphoto">
                <img class="imgstyle" src="${post.photolink}" alt="Mat">
            </div>
            <p class="lookatphototext">Description</p>
            <textarea class="texttoread" readonly name="description" id="" cols="35" rows="5">${post.description}</textarea>
            <p class="lookatphototext">Hashtags</p>
            <textarea class="hashtagstoread" readonly name="hashtags" id="" cols="35" rows="5">${post.hashtags.join(' ')}</textarea>
            <p class="lookatphototext">Author: ${post.author}</p>
            <div class="lookatphotoicons">
                <p class="lookatphototext">Date: ${post.createdAt.toLocaleDateString()}</p>
                <div class="nickandiconsspec">
                    <button type="button" class="buttonsetspec"><img class="iconstyles" src="./ImagesAndIcons/filled-like.png" alt="Bin">
                    <span class="likesamount">${post.likes.length}</span></button>
                </div>
            </div>
        </div>`;

        return false;
    }

    //Возвращает кнопку, параметр функции идёт в качестве надписи
    function makeButton(params) {
        //<button type="button" class="buttonusualadd">Load more</button>
        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'buttonusualadd';
        button.innerHTML = params;
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

    function addLike(id) {
        if (currentName === null) {
            return;
        }
        if (typeof (id) !== 'string') {
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

        if (!module.getPhotoPost(id).likes.every(function (like, index) {
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
        localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
    }

    function editPostLookAtPhotoRestructure(event) {
        currentState = statesMassive.editPostState; //Состояние редактирования фотопоста
        let post = module.getPhotoPost(event.target.closest('.lookatphoto').id);
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        let placeForButton = document.getElementsByClassName('mainplacing')[1];
        let main = document.getElementsByTagName('main')[0];

        let body = document.getElementsByTagName('body')[0];
        let filt = dom.makeFilter();

        mainPlacing = document.getElementsByClassName('mainplacing')[0];

        mainPlacing.innerHTML =
            `<div class="lookatphoto" id="${post.id}">
                <div class="bigphoto">
                    <img class="imgstyle" src="${post.photolink}" alt="Mat">
                </div>
                <div class="imagemarginclass">
                    <label class="imagefilemodinput" for="files">Select Image</label>
                    <input id="files" class="imagefileinput" type="file" name="photo" multiple accept="image/*,image/jpeg">
                </div>
                <p class="lookatphototext">Description</p>
                <textarea class="texttoread" name="description" id="" cols="35" rows="5">${post.description}</textarea>
                <p class="lookatphototext">Hashtags</p>
                <textarea class="hashtagstoread" name="hashtags" id="" cols="35" rows="5">${post.hashtags.join(' ')}</textarea>
                <p class="lookatphototext">Author: ${post.author}</p>
                <div class="lookatphotoicons">
                    <p class="lookatphototext">Date: ${post.createdAt.toLocaleDateString()}</p>
                </div>
                <p class="error-text"></p>
            </div>`;
        let saveButton = dom.makeButton('Save and upload');
        placeForButton.appendChild(saveButton);
    }

    function saveEditButtonRestructure(params) {
        let photoPost = {};

        let img = mainPlacing.getElementsByTagName('img')[0];

        let description = mainPlacing.getElementsByTagName('textarea')[0];

        let hash = mainPlacing.getElementsByTagName('textarea')[1];

        photoPost.photolink = img.src;
        photoPost.description = description.value;
        photoPost.hashtags = hash.value.split(' ');

        if (confirm('Are you sure you want to save changes?')) {
            if (module.editPhotoPost(post.id, photoPost)) {

                mainPlacing.innerHTML = '';
                let filt = dom.makeFilter();
                document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
                dom.showPosts(0, 10);
                dom.showAuthors();
                dom.showHashtags();
                currentState = statesMassive.mainState;
            }
            else {
                let error = mainPlacing.getElementsByClassName('error-text')[0];
                error.innerHTML = 'Sorry, there are some errors in what you have edit';
            }
        }
    }

    function editPostRestructure(event) {
        currentState = statesMassive.editPostState; //Состояние редактирования фотопоста
        let post = module.getPhotoPost(params.target.closest('.post').id);
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        let placeForButton = document.getElementsByClassName('mainplacing')[1];
        let main = document.getElementsByTagName('main')[0];

        let body = document.getElementsByTagName('body')[0];
        let filt = body.getElementsByTagName('aside')[0];

        let backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'buttonback';
        backButton.id = 'Back';
        backButton.innerHTML = 'Back';
        backButton.addEventListener('click', backButtonEvent);

        body.replaceChild(backButton, filt);

        mainPlacing = document.getElementsByClassName('mainplacing')[0];

        mainPlacing.innerHTML =
            `<div class="lookatphoto" id="${post.id}">
                <div class="bigphoto">
                    <img class="imgstyle" src="${post.photolink}" alt="Mat">
                </div>
                <div class="imagemarginclass">
                    <label class="imagefilemodinput" for="files">Select Image</label>
                    <input id="files" class="imagefileinput" type="file" name="photo" multiple accept="image/*,image/jpeg">
                </div>
                <p class="lookatphototext">Description</p>
                <textarea class="texttoread" name="description" id="" cols="35" rows="5">${post.description}</textarea>
                <p class="lookatphototext">Hashtags</p>
                <textarea class="hashtagstoread" name="hashtags" id="" cols="35" rows="5">${post.hashtags.join(' ')}</textarea>
                <p class="lookatphototext">Author: ${post.author}</p>
                <div class="lookatphotoicons">
                    <p class="lookatphototext">Date: ${post.createdAt.toLocaleDateString()}</p>
                </div>
                <p class="error-text"></p>
            </div>`;
        let saveButton = dom.makeButton('Save and upload');

        if (placeForButton.getElementsByTagName('button')[0] !== undefined) {
            placeForButton.replaceChild(saveButton, placeForButton.getElementsByTagName('button')[0]);
        }
        else {
            placeForButton.appendChild(saveButton);
        }
    }

    function uploadButtonRestucture(params) {
        let ID = module.getNewID();
        let img = mainPlacing.getElementsByTagName('img')[0];

        let description = mainPlacing.getElementsByTagName('textarea')[0];

        let hash = mainPlacing.getElementsByTagName('textarea')[1];
        let hashTags = hash.value.split(' ');
        for (let index = 0; index < hashTags.length; index++) {
            if (hashTags[index] === '') {
                hashTags.splice(index, 1);
            }
        }

        let photoPost = new Photopost(ID, description.value, new Date(), currentName, img.src, [], hashTags);

        /*photoPost.photolink = img.src;
        photoPost.description = description.value;
        photoPost.hashtags = hash.value.split(' ');*/
        if (confirm('Are you sure you want to save changes and upload new photopost?')) {
            if (module.addPhotoPost(photoPost)) {
                mainPlacing.innerHTML = '';
                let filt = dom.makeFilter();
                document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
                dom.showPosts(0, 10);
                dom.showAuthors();
                dom.showHashtags();
                //localStorage.removeItem('photoPosts');
                currentState = statesMassive.mainState;
                localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
            }
            else {
                let error = mainPlacing.getElementsByClassName('error-text')[0];
                error.innerHTML = 'Sorry, there are some errors in what you try to upload';
            }
        }
    }

    function uploadPostRestructure(event) {
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        let placeForButton = document.getElementsByClassName('mainplacing')[1];
        let main = document.getElementsByTagName('main')[0];

        let body = document.getElementsByTagName('body')[0];
        let filt = body.getElementsByTagName('aside')[0];

        let backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'buttonback';
        backButton.id = 'Back';
        backButton.innerHTML = 'Back';
        backButton.addEventListener('click', eve.backButtonEvent);

        if (filt !== undefined) {
            body.replaceChild(backButton, filt);
        }

        mainPlacing = document.getElementsByClassName('mainplacing')[0];

        mainPlacing.innerHTML =
            `<div class="lookatphoto">
                <div class="bigphoto">
                    <img class="imgstyle">
                </div>
                <div class="imagemarginclass">
                    <label class="imagefilemodinput" for="files">Select Image</label>
                    <input id="files" class="imagefileinput" type="file" name="photo" multiple accept="image/*,image/jpeg">
                </div>
                <p class="lookatphototext">Description</p>
                <textarea class="texttoread" name="description" id="" cols="35" rows="5"></textarea>
                <p class="lookatphototext">Hashtags</p>
                <textarea class="hashtagstoread" name="hashtags" id="" cols="35" rows="5"></textarea>
                <p class="lookatphototext">Author: ${currentName}</p>
                <div class="lookatphotoicons">
                    <p class="lookatphototext">Date: ${(new Date()).toLocaleDateString()}</p>
                </div>
                <p class="error-text"></p>
            </div>`;

        let uploadButton = dom.makeButton('Save and upload');
        //let anchor = document.createElement('a');
        //anchor.setAttribute('href', "#top");
        //anchor.appendChild(uploadButton);

        if (placeForButton.getElementsByTagName('button')[0] !== undefined) {
            placeForButton.replaceChild(uploadButton, placeForButton.getElementsByTagName('button')[0]);
        }
        else {
            placeForButton.appendChild(uploadButton);
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
        if (username === '' || username === null) {
            username = undefined;
        }
        var islogined = (username !== undefined);
        if (islogined) {
            document.getElementsByClassName('nicknamealign')[0].innerHTML = `<p> ${username} </p>`;
            document.getElementsByClassName('headeralign')[0].innerHTML =
                `<a href = "#top">
            <button type="button" class="buttonusual">
            Add photo</button>
            </a>
            <button type="button" class="buttonusual">Exit</button>`;
            currentName = username;

            let exitButton = document.getElementsByClassName('headeralign')[0].getElementsByTagName('button')[1];
            exitButton.addEventListener('click', eve.exit);

            let addPhotoButton = document.getElementsByClassName('headeralign')[0].getElementsByTagName('button')[0];
            addPhotoButton.addEventListener('click', eve.uploadPost);

            localStorage.setItem('currentName', JSON.stringify(currentName));
        }
        else {
            document.getElementsByClassName('nicknamealign')[0].innerHTML = '';
            document.getElementsByClassName('headeralign')[0].innerHTML = `<button type="button" class="buttonusual">Login</button>`;
            currentName = null;
            var header = document.getElementsByClassName('headeralign')[0];
            var but = header.getElementsByTagName('button')[0];
            but.addEventListener('click', eve.login);

            localStorage.setItem('currentName', JSON.stringify(currentName));
        }
        if (currentState === statesMassive.mainState) {
            showPosts(0, latestTop + latestSkip, latestFilterConfig);//Поменял параметры фильтра   
        }
        if (currentState === statesMassive.editPostState) {
            showPosts(0, 10);
            let filt = dom.makeFilter();
            if (document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0] !== undefined) {
                document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
            }
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
                `<button type="button" class="buttonset"><img class="iconstyles" src="./ImagesAndIcons/delete-512.png" alt="Bin"></button>
            <button type="button" class="buttonset"><a href="#top"><img class="iconstyles" src="./ImagesAndIcons/221649.png" alt="Edit"></a></button>
            <button type="button" class="buttonset"><a href="#top"><img class="iconstyles" src="./ImagesAndIcons/comments.png" alt="Bin"></a></button>
            <button type="button" class="buttonset"><img class="iconstyles" src="./ImagesAndIcons/filled-like.png" alt="Bin"> 
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
        else {
            icons.innerHTML =
                `<button type="button" class="buttonset"><a href="#top"><img class="iconstyles" src="./ImagesAndIcons/comments.png" alt="Bin"></a></button>
            <button type="button" class="buttonset"><img class="iconstyles" src="./ImagesAndIcons/filled-like.png" alt="Bin"> 
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

    function addPhotopost(photopost) {
        if (module.addPhotoPost(photopost)) {
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
        if (module.removePhotoPost(id)) {
            localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
            showPosts(0, latestSkip + latestTop, latestFilterConfig);//Поменял параметры фильтра
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
        if (module.editPhotoPost(id, photoPost)) {
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
        if (module.getPhotoPosts(latestSkip + latestTop, 10, latestFilterConfig).length === 0) {
            document.getElementsByClassName('mainplacing')[1].innerHTML = '';
        }
    }

    function addMorePosts() {
        //latestSkip = latestSkip + 10;

        var photoPosts = module.getPhotoPosts(latestTop + latestSkip, 10, latestFilterConfig);

        if (photoPosts === undefined) {
            return;
        }

        photoPosts.forEach(function (photopost) {
            showPhotopost(photopost);
        });

        latestTop = latestTop + 10;

        if (module.getPhotoPosts(latestTop + latestSkip, 10, latestFilterConfig).length === 0) {
            document.getElementsByClassName('mainplacing')[1].innerHTML = '';
        }
    }

    function startPageDownload(params) {

        photoPosts = JSON.parse(localStorage.getItem('photoPosts'), function (key, value) {
            if (key == 'createdAt')
                return new Date(value);
            return value;
        });
        if (photoPosts === null) {
            photoPosts = [];
        }

        currentName = JSON.parse(localStorage.getItem('currentName'));

        //Отображаение первых 10 постов
        dom.showPosts(0, 10);

        dom.checkLogin(currentName);

        let header = document.getElementsByTagName('main')[0];

        let body = document.getElementsByTagName('body')[0];

        body.insertBefore(dom.makeFilter(), header);

        let loadMoreButton = document.getElementsByClassName('mainplacing')[1].getElementsByTagName('button')[0];
        if (loadMoreButton !== undefined && loadMoreButton !== null) {
            loadMoreButton.addEventListener('click', eve.addMore);
        }

        let filterButton = document.getElementsByTagName('aside')[0].getElementsByClassName('buttonusual')[0];
        if (filterButton !== undefined && filterButton !== null) {
            filterButton.addEventListener('click', eve.filter);
        }

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
        makeButton: makeButton,
        startPageDownload: startPageDownload,
        backButtonRestructure: backButtonRestructure,
        loginRestructure: loginRestructure,
        pressLoginRestructure: pressLoginRestructure,
        lookAtPhotoRestructure: lookAtPhotoRestructure,
        editPostLookAtPhotoRestructure: editPostLookAtPhotoRestructure,
        saveEditButtonRestructure: saveEditButtonRestructure,
        editPostRestructure: editPostRestructure,
        uploadPostRestructure: uploadPostRestructure,
        uploadButtonRestucture: uploadButtonRestucture
    }
}();

dom.startPageDownload();
/*
//Редактирование
dom.editPost('9', {description: 'Hello, world!!!', photolink: './ImagesAndIcons/tmp852896240201891842.jpg', likes: ['Vasia', 'Kolia'], hashtags: ['#2018', 'wronghash', '#NewYear']});

//Удаление фотопоста с id = 9
dom.deletePhotopost('9');

//Добавление нового фотопоста с id = 9
dom.addPhotopost(new Photopost('9', 'description20', new Date('2018-03-16T02:20:00'), 'Kolia', './ImagesAndIcons/1477469601_nature_gora.jpg', ['Vasia', 'Petia'], ['#summer', '#2018']));

//Логин
dom.checkLogin('Vasia');

//Ставим лайк посту с ID = 9
dom.addLike('9');

//Убираем лайк всё тому же посту с ID = 9
dom.addLike('9');

dom.checkLogin();*/