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

var view = function () {
    function backButtonRestructure(event) {
        let main = document.getElementsByClassName('mainplacing')[0];
        main.innerHTML = '';
        let filt = view.makeFilter();
        document.getElementsByTagName('body')[0].replaceChild(filt, event.target);
        view.showPosts(0, 10);
        if (currentName !== null && currentName !== '') {
            view.checkLogin(currentName);
        }
        else {
            view.checkLogin();
        }
        view.showAuthors();
        view.showHashtags();
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
            backButton.addEventListener('click', controller.backButtonEvent);

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
                let filt = view.makeFilter();
                document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
                view.checkLogin(users[index].login);
                view.showPosts(0, 10);
                view.showAuthors();
                view.showHashtags();
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
        let post = model.getPhotoPost(event.target.closest('.post').id);
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
        backButton.addEventListener('click', controller.backButtonEvent);

        body.replaceChild(backButton, filt);

        mainPlacing = document.getElementsByClassName('mainplacing')[0];


        if (currentName === model.getPhotoPost(event.target.closest('.post').id).author) {
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
        //button.addEventListener('click', controller.addMore);
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
        filt.getElementsByClassName('buttonusual')[0].addEventListener('click', controller.filter);
        return filt;
    }

    function addLike(id) {
        if (currentName === null) {
            return;
        }
        if (typeof (id) !== 'string') {
            return;
        }

        let post = model.getPhotoPost(id);

        if (post === undefined) {
            return;
        }

        if (!post.likes.every(function (like, index) {
            if (like === currentName) {
                post.likes.splice(index, 1);

                let postDom = document.getElementById(id);
                if (postDom !== null) {
                    let amountOfLikes = postDom.getElementsByClassName('likesamount')[0];
                    amountOfLikes.innerHTML = post.likes.length;
                }
                return false;
            }
            return true;
        })) {
            return;
        }

        post.likes.push(currentName);

        let postDom = document.getElementById(id);
        if (postDom !== null) {
            let amountOfLikes = postDom.getElementsByClassName('likesamount')[0];
            amountOfLikes.innerHTML = post.likes.length;
        }

        let photoEdit = {};
        photoEdit.likes = post.likes; 
        
        model.editPhotoPost(id, photoEdit);
    }

    function editPostLookAtPhotoRestructure(event) {
        currentState = statesMassive.editPostState; //Состояние редактирования фотопоста
        let post = model.getPhotoPost(event.target.closest('.lookatphoto').id);
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        let placeForButton = document.getElementsByClassName('mainplacing')[1];
        let main = document.getElementsByTagName('main')[0];

        let body = document.getElementsByTagName('body')[0];
        let filt = view.makeFilter();

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
        let saveButton = view.makeButton('Save and upload');
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
            if (model.editPhotoPost(post.id, photoPost)) {

                mainPlacing.innerHTML = '';
                let filt = view.makeFilter();
                document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
                view.showPosts(0, 10);
                view.showAuthors();
                view.showHashtags();
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
        let post = model.getPhotoPost(params.target.closest('.post').id);
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
        let saveButton = view.makeButton('Save and upload');

        if (placeForButton.getElementsByTagName('button')[0] !== undefined) {
            placeForButton.replaceChild(saveButton, placeForButton.getElementsByTagName('button')[0]);
        }
        else {
            placeForButton.appendChild(saveButton);
        }
    }

    function uploadButtonRestucture(params) {
        let ID = '0';
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
            if (model.addPhotoPost(photoPost)) {
                mainPlacing.innerHTML = '';
                let filt = view.makeFilter();
                document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
                view.showPosts(0, 10);
                view.showAuthors();
                view.showHashtags();
                currentState = statesMassive.mainState;
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
        backButton.addEventListener('click', controller.backButtonEvent);

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

        let uploadButton = view.makeButton('Save and upload');

        if (placeForButton.getElementsByTagName('button')[0] !== undefined) {
            placeForButton.replaceChild(uploadButton, placeForButton.getElementsByTagName('button')[0]);
        }
        else {
            placeForButton.appendChild(uploadButton);
        }
    }

    var hashtags = [];
    function findUniqueHashtags() {
        hashtags = model.findUniqueHashtags();
    }

    var authorNames = [];
    function findUniqueNames() {
        authorNames = model.findUniqueNames();
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
            exitButton.addEventListener('click', controller.exit);

            let addPhotoButton = document.getElementsByClassName('headeralign')[0].getElementsByTagName('button')[0];
            addPhotoButton.addEventListener('click', controller.uploadPost);

            localStorage.setItem('currentName', JSON.stringify(currentName));
        }
        else {
            document.getElementsByClassName('nicknamealign')[0].innerHTML = '';
            document.getElementsByClassName('headeralign')[0].innerHTML = `<button type="button" class="buttonusual">Login</button>`;
            currentName = null;
            var header = document.getElementsByClassName('headeralign')[0];
            var but = header.getElementsByTagName('button')[0];
            but.addEventListener('click', controller.login);

            localStorage.setItem('currentName', JSON.stringify(currentName));
        }
        if (currentState === statesMassive.mainState) {
            showPosts(0, latestTop + latestSkip, latestFilterConfig);//Поменял параметры фильтра   
        }
        if (currentState === statesMassive.editPostState) {
            showPosts(0, 10);
            let filt = view.makeFilter();
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
            likes.addEventListener('click', controller.like);

            let look = icons.getElementsByTagName('button')[2];
            look.addEventListener('click', controller.lookAtPhoto);

            let edit = icons.getElementsByTagName('button')[1];
            edit.addEventListener('click', controller.editPost);

            let del = icons.getElementsByTagName('button')[0];
            del.addEventListener('click', controller.deletePost);
        }
        else {
            icons.innerHTML =
                `<button type="button" class="buttonset"><a href="#top"><img class="iconstyles" src="./ImagesAndIcons/comments.png" alt="Bin"></a></button>
            <button type="button" class="buttonset"><img class="iconstyles" src="./ImagesAndIcons/filled-like.png" alt="Bin"> 
            <span class="likesamount">${photopost.likes.length}</span></button>`;

            let likes = icons.getElementsByTagName('button')[1];
            likes.addEventListener('click', controller.like);
            let look = icons.getElementsByTagName('button')[0];
            look.addEventListener('click', controller.lookAtPhoto);
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
        if (model.addPhotoPost(photopost)) {
            showPosts(0, 10);//Поменял параметры фильтра
        }
    }

    function deletephotopost(id) {
        /*var goalPost = module.getPhotoPost(id);
        if (goalPost === undefined) {
            return false;
        }
        if (currentName !== goalPost.author) {
            return false;
        }*/
        if (model.removePhotoPost(id)) {
            showPosts(0, latestSkip + latestTop, latestFilterConfig);//Поменял параметры фильтра
        }
    }

    function editPost(id, photoPost) {
        /*var goalPost = model.getPhotoPost(id);
        if (goalPost === undefined) {
            return false;
        }
        if (currentName !== goalPost.author) {
            return false;
        }*/
        if (model.editPhotoPost(id, photoPost)) {
            showPosts(0, 10);//Поменял параметры фильтра
        }
        return true;
    }

    function showPosts(skip, top, filterConfig) {
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        document.getElementsByClassName('mainplacing')[1].innerHTML = `<button type="button" 
        class="buttonusualadd">Load more</button>`;

        var photoPosts = model.getPhotoPosts(skip, top, filterConfig);

        if (photoPosts === undefined) {
            return;
        }

        photoPosts.forEach(function (photopost) {
            showPhotopost(photopost);
        });

        latestSkip = skip;
        latestTop = top;
        latestFilterConfig = filterConfig;
        if (model.getPhotoPosts(skip, top, filterConfig).length === 0) {
            document.getElementsByClassName('mainplacing')[1].innerHTML = '';
            return;
        }

        var loadMorButton = document.getElementsByClassName('mainplacing')[1].getElementsByTagName('button')[0];
        loadMorButton.addEventListener('click', controller.addMore);
        if (model.getPhotoPosts(latestSkip + latestTop, 10, latestFilterConfig).length === 0) {
            document.getElementsByClassName('mainplacing')[1].innerHTML = '';
        }
    }

    function addMorePosts() {
        //latestSkip = latestSkip + 10;

        var photoPosts = model.getPhotoPosts(latestTop + latestSkip, 10, latestFilterConfig);

        if (photoPosts === undefined) {
            return;
        }

        photoPosts.forEach(function (photopost) {
            showPhotopost(photopost);
        });

        latestTop = latestTop + 10;

        if (model.getPhotoPosts(latestTop + latestSkip, 10, latestFilterConfig).length === 0) {
            document.getElementsByClassName('mainplacing')[1].innerHTML = '';
        }
    }

    function startPageDownload(params) {
        currentName = JSON.parse(localStorage.getItem('currentName'));

        //Отображаение первых 10 постов
        view.showPosts(0, 10);

        view.checkLogin(currentName);

        let header = document.getElementsByTagName('main')[0];

        let body = document.getElementsByTagName('body')[0];

        body.insertBefore(view.makeFilter(), header);

        let loadMoreButton = document.getElementsByClassName('mainplacing')[1].getElementsByTagName('button')[0];
        if (loadMoreButton !== undefined && loadMoreButton !== null) {
            loadMoreButton.addEventListener('click', controller.addMore);
        }

        let filterButton = document.getElementsByTagName('aside')[0].getElementsByClassName('buttonusual')[0];
        if (filterButton !== undefined && filterButton !== null) {
            filterButton.addEventListener('click', controller.filter);
        }

        //Вывод тегов
        view.showHashtags();

        //Вывод авторов
        view.showAuthors();
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

view.startPageDownload();
/*
//Редактирование
view.editPost('9', {description: 'Hello, world!!!', photolink: './ImagesAndIcons/tmp852896240201891842.jpg', likes: ['Vasia', 'Kolia'], hashtags: ['#2018', 'wronghash', '#NewYear']});

//Удаление фотопоста с id = 9
view.deletePhotopost('9');

//Добавление нового фотопоста с id = 9
view.addPhotopost(new Photopost('9', 'description20', new Date('2018-03-16T02:20:00'), 'Kolia', './ImagesAndIcons/1477469601_nature_gora.jpg', ['Vasia', 'Petia'], ['#summer', '#2018']));

//Логин
view.checkLogin('Vasia');

//Ставим лайк посту с ID = 9
view.addLike('9');

//Убираем лайк всё тому же посту с ID = 9
view.addLike('9');

view.checkLogin();*/