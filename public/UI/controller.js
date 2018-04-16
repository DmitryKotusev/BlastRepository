var eve = function () {
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

    function backButtonEvent(event) {
        dom.backButtonRestructure(event);
    }

    function login(event) {
        dom.loginRestructure(event);
        let main = document.getElementsByClassName('mainplacing')[0];
        let loginButton = main.getElementsByTagName('button')[0];
        loginButton.addEventListener('click', dom.pressLoginRestructure);
    }

    function exit(params) {
        if (confirm("Are you sure you want to exit?")) {
            dom.checkLogin();
            return;
        }
    }

    function lookAtPhoto(event) {
        if (dom.lookAtPhotoRestructure(event)) {
            //Connect events if this post is yours
            let amountOfLikes = mainPlacing.getElementsByTagName('button')[2];
            amountOfLikes.addEventListener('click', likeLookAt);
            let editButton = mainPlacing.getElementsByTagName('button')[1];
            editButton.addEventListener('click', editPostLookAtPhoto);
            let deleteButton = mainPlacing.getElementsByTagName('button')[0];
            deleteButton.addEventListener('click', deletePostLookAtPhoto);
            ////////////////////
        }
        else {
            //Connect events if this post is not yours
            let amountOfLikes = mainPlacing.getElementsByTagName('button')[0];
            amountOfLikes.addEventListener('click', likeLookAt);
            ////////////////////
        }
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

    function deletePost(params) {
        if (confirm("Are you sure you want to delete this post?")) {
            var button = event.target;
            var id = button.closest('.post').id;
            dom.deletePhotopost(id);
        }
    }

    function deletePostLookAtPhoto(params) {
        if (confirm("Are you sure you want to delete this post?")) {
            var button = event.target;
            var id = button.closest('.lookatphoto').id;
            let filt = dom.makeFilter();
            document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
            dom.showPosts(0, 10);
            dom.showAuthors();
            dom.showHashtags();
            currentState = statesMassive.mainState;
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
    /////ПЕРЕДЕЛАТЬ ЭТОТ МЕТОД!!!!!!
    function updateImageDisplay(event) {
        let photoWrapper = event.target.closest('.lookatphoto');
        let image = photoWrapper.getElementsByClassName('imgstyle')[0];
        //let buff = window.URL.createObjectURL(event.target.files[0]);
        //image.src = window.URL.createObjectURL(event.target.files[0]);
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onloadend = function () {
            image.src = reader.result;
        };
    }

    function editPostLookAtPhoto(event) {
        dom.editPostLookAtPhotoRestructure(event);
        let input = mainPlacing.getElementsByClassName('imagefileinput')[0];
        input.addEventListener('change', updateImageDisplay);
        let saveButton = document.getElementsByClassName('mainplacing')[1].lastChild;
        saveButton.addEventListener('click', dom.saveEditButtonRestructure);
    }

    function editPost(event) {
        dom.editPostRestructure(event);
        let input = mainPlacing.getElementsByClassName('imagefileinput')[0];
        input.addEventListener('change', updateImageDisplay);
        let saveButton = document.getElementsByClassName('mainplacing')[1].lastChild;
        saveButton.addEventListener('click', dom.saveEditButtonRestructure);
    }

    function uploadPost(event) {
        if (currentState === statesMassive.uploadPostState) {
            return;
        }
        currentState = statesMassive.uploadPostState; //Состояние добавления фотопоста

        dom.uploadPostRestructure(event);
        let input = mainPlacing.getElementsByClassName('imagefileinput')[0];
        input.addEventListener('change', updateImageDisplay);
        let uploadButton = document.getElementsByClassName('mainplacing')[1].lastChild;
        uploadButton.addEventListener('click', dom.uploadButtonRestucture);
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
        uploadPost: uploadPost,
        backButtonEvent: backButtonEvent
    }
}();