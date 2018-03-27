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
        if (currentName !== '') {
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
            <p class="error-text"><\p>
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
                        <button type="button" class="buttonsetspec"><img class="iconstyles" src="../ImagesAndIcons/delete-512.png" alt="Bin"></button>
                        <button type="button" class="buttonsetspec"><img class="iconstyles" src="../ImagesAndIcons/221649.png" alt="Edit"></button>
                        <button type="button" class="buttonsetspec"><img class="iconstyles" src="../ImagesAndIcons/filled-like.png" alt="Bin">
                        <span class="likesamount">${post.likes.length}</span></button>
                    </div>
                </div>
            </div>`;
            //Прикрепить события
            let amountOfLikes = mainPlacing.getElementsByTagName('button')[2];
            amountOfLikes.addEventListener('click', likeLookAt);
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
                    <button type="button" class="buttonsetspec"><img class="iconstyles" src="../ImagesAndIcons/filled-like.png" alt="Bin">
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

    function selectHashEve(params) {
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
    }

    function deletePost(params) {
        if (confirm("Are you sure you want to delete this post?"))
        {
            var button = event.target;
            var id = button.closest('.post').id;
            dom.deletePhotopost(id);
        }
    }

    return {
        like: like,
        addMore: addMore,
        login: login,
        exit: exit,
        lookAtPhoto: lookAtPhoto,
        filter: filter,
        selectHashEve: selectHashEve,
        selectAuthorEve: selectAuthorEve,
        deletePost: deletePost
    }
}();
document.getElementsByClassName('mainplacing')[1].getElementsByTagName('button')[0].addEventListener('click', eve.addMore);

document.getElementsByClassName('headeralign')[0].getElementsByTagName('button')[0].addEventListener('click', eve.login);

document.getElementsByTagName('aside')[0].getElementsByClassName('buttonusual')[0].addEventListener('click', eve.filter);