var eve = function() {
    function like(event) {
        var button = event.target;
        var id = button.closest('.post').id;
        dom.addLike(id);
    }

    function likeLookAt(event) {
        var button = event.target;
        var id = button.closest('.lookatphoto').id;
        dom.addLike(id);
    }

    function addMore(event) {
        dom.addMorePosts();
    }

    function backButtonEvent(params) {
        let main = document.getElementsByClassName('mainplacing')[0];
        main.innerHTML = '';
        let filt = dom.makeFilter();
        document.getElementsByTagName('body')[0].replaceChild(filt, event.target);
        dom.showPosts(0, 10);
        if (currentName !== null && currentName !== '') {
            dom.checkLogin(currentName);   
        }
        else
        {
            dom.checkLogin();
        }
        dom.showAuthors();
        dom.showHashtags();
        currentState = 0;
    }

    function login(params) {
        currentState = 1;//Состояние логина
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
            backButton.addEventListener('click', backButtonEvent);

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

        let loginButton = main.getElementsByTagName('button')[0];

        loginButton.addEventListener('click', 
        function name(params) {
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
                    currentState = 0;
                    return;
                }
            }

            //Вывод ошибки
            let errorText = document.getElementsByClassName('mainplacing')[0].getElementsByTagName('p')[1];
            errorText.innerHTML = 'Error, invalid login or password';
        })
    }

    function exit(params) {
        if (confirm("Are you sure you want to exit?")) {
            dom.checkLogin();
            return;
        }
    }

    function lookAtPhoto(params) {
        currentState = 2; //Состояние просмотра фотографии
        let post = module.getPhotoPost(params.target.closest('.post').id);
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
        backButton.addEventListener('click', backButtonEvent);

        body.replaceChild(backButton, filt);
        
        mainPlacing = document.getElementsByClassName('mainplacing')[0];
        
        
        if (currentName === module.getPhotoPost(params.target.closest('.post').id).author) {
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
            //Прикрепить события
            let amountOfLikes = mainPlacing.getElementsByTagName('button')[2];
            amountOfLikes.addEventListener('click', likeLookAt);
            let editButton = mainPlacing.getElementsByTagName('button')[1];
            editButton.addEventListener('click', editPostLookAtPhoto);
            let deleteButton = mainPlacing.getElementsByTagName('button')[0];
            deleteButton.addEventListener('click', deletePostLookAtPhoto);
            ////////////////////
            return;
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
        //Прикрепить события
        let amountOfLikes = mainPlacing.getElementsByTagName('button')[0];
        amountOfLikes.addEventListener('click', likeLookAt);
        ////////////////////
    }

    function isValidDate(y, m, d) {
        let dt = new Date(y, m, d);
        let isValid = (y == dt.getFullYear()) && ((m) == dt.getMonth()) && (d == dt.getDate());
        return isValid;
    }

    function filter(params) {
        let filt = document.getElementsByTagName('aside')[0];
        
        let authorCheck = document.getElementsByName('authorcheck')[0];//Чекбокс
        let hashCheck = document.getElementsByName('hashtagcheck')[0];//Чекбокс
        let dateCheck = document.getElementsByName('datecheck')[0];//Чекбокс
        let author = document.getElementsByName('author')[0];//input поле
        let hashtag = document.getElementsByName('hashtag')[0];//input поле
        let day = document.getElementsByName('day')[0];//input поле
        let month = document.getElementsByName('month')[0];//input поле
        let year = document.getElementsByName('year')[0];//input поле
        var filterConfig = {};

        if (authorCheck.checked) {
            if (author.value !== '') {
                filterConfig.author = author.value;
            }
        }

        if (hashCheck.checked) {
            if (hashtag.value !== '') {
                let tags = hashtag.value.split(' ');
                filterConfig.hashtags = [];
                tags.forEach(element => {
                    if (module.validhash(element)) {
                        filterConfig.hashtags.push(element);
                    }
                });
            }
        }

        if (dateCheck.checked) {
            if (day.value !== '' && month.value !== '' && year.value !== '') {
                let daynum = +day.value;
                let daymonth = +month.value - 1;
                let dayyear = +year.value;
                if (isValidDate(dayyear, daymonth, daynum)) {
                    filterConfig.createdAt = new Date(dayyear, daymonth, daynum);
                }
            }
        }
        dom.showPosts(0, 10, filterConfig);
    }

    /*function selectHashEve(params) {
        let option = params.target;
        let filterContent = option.closest('.filtercontent');
        let input = filterContent.getElementsByTagName('input')[1];
        input.value += ' ' + option.value;
    }

    function selectAuthorEve(params) {
        let option = params.target;
        let filterContent = option.closest('.filtercontent');
        let input = filterContent.getElementsByTagName('input')[1];
        input.value = option.value;
    }*/

    function deletePost(params) {
        if (confirm("Are you sure you want to delete this post?"))
        {
            var button = event.target;
            var id = button.closest('.post').id;
            dom.deletePhotopost(id);
        }
    }

    function deletePostLookAtPhoto(params) {
        if (confirm("Are you sure you want to delete this post?"))
        {
            var button = event.target;
            var id = button.closest('.lookatphoto').id;
            let filt = dom.makeFilter();
            document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
            dom.showPosts(0, 10);
            dom.showAuthors();
            dom.showHashtags();
            currentState = 0;
            dom.deletePhotopost(id);
        }
    }

    /*function setImgSrc(src) {
        let submitPost = document.forms.submitPost;
        submitPost.value = src;
    }

    function loadFoto(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImgSrc(reader.result);
        };
    }*/

    function updateImageDisplay(params) {
        let photoWrapper = params.target.closest('.lookatphoto');
        let image = photoWrapper.getElementsByClassName('imgstyle')[0];
        //let buff = window.URL.createObjectURL(params.target.files[0]);
        //image.src = window.URL.createObjectURL(params.target.files[0]);
        let reader = new FileReader();
        reader.readAsDataURL(params.target.files[0]);
        reader.onloadend = function () {
            image.src = reader.result;
        }; 
    }

    function editPostLookAtPhoto(params) {
        currentState = 3; //Состояние редактирования фотопоста
        let post = module.getPhotoPost(params.target.closest('.lookatphoto').id);
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        //let loadMoresect = document.getElementsByClassName('mainplacing')[1];
        let placeForButton = document.getElementsByClassName('mainplacing')[1];
        let main = document.getElementsByTagName('main')[0];
        //main.removeChild(loadMoresect);

        let body = document.getElementsByTagName('body')[0];
        let filt = dom.makeFilter();

        /*let backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'buttonback';
        backButton.id = 'Back';
        backButton.innerHTML = 'Back';
        backButton.addEventListener('click', backButtonEvent);

        body.replaceChild(backButton, filt);*/

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
        let saveButton = dom.makeSaveButton();
        placeForButton.appendChild(saveButton);

        let input = mainPlacing.getElementsByClassName('imagefileinput')[0];
        input.addEventListener('change', updateImageDisplay);

        saveButton.addEventListener('click',function (params) {
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
                    currentState = 0;
                }
                else
                {
                    let error = mainPlacing.getElementsByClassName('error-text')[0];
                    error.innerHTML = 'Sorry, there are some errors in what you have edit';
                }
            }
        })
    }

    function editPost(params) {
        currentState = 3; //Состояние редактирования фотопоста
        let post = module.getPhotoPost(params.target.closest('.post').id);
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        //let loadMoresect = document.getElementsByClassName('mainplacing')[1];
        let placeForButton = document.getElementsByClassName('mainplacing')[1];
        let main = document.getElementsByTagName('main')[0];
        //main.removeChild(loadMoresect);

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
        let saveButton = dom.makeSaveButton();

        if (placeForButton.getElementsByTagName('button')[0] !== undefined) {
            placeForButton.replaceChild(saveButton, placeForButton.getElementsByTagName('button')[0]);
        }
        else
        {
            placeForButton.appendChild(saveButton);
        }

        let input = mainPlacing.getElementsByClassName('imagefileinput')[0];
        input.addEventListener('change', updateImageDisplay);

        saveButton.addEventListener('click',function (params) {
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
                    currentState = 0;
                }
                else
                {
                    let error = mainPlacing.getElementsByClassName('error-text')[0];
                    error.innerHTML = 'Sorry, there are some errors in what you have edit';
                }
            }
        })
    }

    function uploadPost(params) {
        currentState = 4; //Состояние добавления фотопоста
        
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        //let loadMoresect = document.getElementsByClassName('mainplacing')[1];
        let placeForButton = document.getElementsByClassName('mainplacing')[1];
        let main = document.getElementsByTagName('main')[0];
        //main.removeChild(loadMoresect);

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
            `<div class="lookatphoto">
                <div class="bigphoto">
                    <img class="imgstyle" src="">
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

        let input = mainPlacing.getElementsByClassName('imagefileinput')[0];
        input.addEventListener('change', updateImageDisplay);

        let uploadButton = dom.makeUploadButton();
        
        if (placeForButton.getElementsByTagName('button')[0] !== undefined) {
            placeForButton.replaceChild(uploadButton, placeForButton.getElementsByTagName('button')[0]);
        }
        else
        {
            placeForButton.appendChild(uploadButton);
        }

        uploadButton.addEventListener('click', function (params) {
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
                    localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
                    currentState = 0;
                }
                else
                {
                    let error = mainPlacing.getElementsByClassName('error-text')[0];
                    error.innerHTML = 'Sorry, there are some errors in what you try to upload';
                }
            }           
        })
    }

    return {
        like: like,
        addMore: addMore,
        login: login,
        exit: exit,
        lookAtPhoto: lookAtPhoto,
        filter: filter,
        deletePost: deletePost,
        editPost: editPost,
        uploadPost: uploadPost
    }
}();