var controller = function () {
    async function like(event) {
        var button = event.target;
        var id = button.closest('.post').id;
        if (currentName === null) {
            return;
        }
        if (typeof (id) !== 'string') {
            return;
        }

        let post = await model.getPhotoPost(id);

        if (post === undefined) {
            return;
        }

        if (!post.likes.every(function (like, index) {
            if (like === currentName) {
                post.likes.splice(index, 1);

                return false;
            }
            return true;
        })) {
            let photoEdit = {};
            photoEdit.likes = post.likes;

            await model.editPhotoPost(id, photoEdit);
            view.addLike(post);
            return;
        }

        post.likes.push(currentName);

        view.addLike(post);

        let photoEdit = {};
        photoEdit.likes = post.likes;

        await model.editPhotoPost(id, photoEdit);
    }

    function validhash(item) {
        if (typeof (item) !== 'string') {
            return false;
        }
        if (item.charAt(0) !== '#') {
            return false;
        }
        for (let index = 1; index < item.length; index++) {
            if (item.charAt(index) === ' ' || item.charAt(index) === '#' || item.charAt(index) === ',' || item.charAt(index) === '.') {
                return false;
            }
        }
        return true;
    }

    async function likeLookAt(event) {
        var button = event.target;
        var id = button.closest('.lookatphoto').id;
        if (currentName === null) {
            return;
        }
        if (typeof (id) !== 'string') {
            return;
        }

        let post = await model.getPhotoPost(id);

        if (post === undefined) {
            return;
        }

        if (!post.likes.every(await async function (like, index) {
            if (like === currentName) {
                post.likes.splice(index, 1);

                return false;
            }
            return true;
        })) {
            let photoEdit = {};
            photoEdit.likes = post.likes;

            await model.editPhotoPost(id, photoEdit);
            view.addLike(post);
            return;
        }

        post.likes.push(currentName);

        view.addLike(post);

        let photoEdit = {};
        photoEdit.likes = post.likes;

        await model.editPhotoPost(id, photoEdit);
    }

    function addMore(event) {
        view.addMorePosts();
    }

    function backButtonEvent(event) {
        view.backButtonRestructure(event);
    }

    function login(event) {
        view.loginRestructure(event);
        let main = document.getElementsByClassName('mainplacing')[0];
        let loginButton = main.getElementsByTagName('button')[0];
        loginButton.addEventListener('click', view.pressLoginRestructure);
    }

    async function exit(params) {
        if (confirm("Are you sure you want to exit?")) {
            await view.checkLogin();
            return;
        }
    }

    async function lookAtPhoto(event) {
        if (await view.lookAtPhotoRestructure(event)) {
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

    async function filter(params) {
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
                    if (validhash(element)) {
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
        await view.showPosts(0, 10, filterConfig);
    }

    async function deletePost(params) {
        if (confirm("Are you sure you want to delete this post?")) {
            var button = event.target;
            var id = button.closest('.post').id;
            await view.deletePhotopost(id);
        }
    }

    async function deletePostLookAtPhoto(params) {
        if (confirm("Are you sure you want to delete this post?")) {
            var button = event.target;
            var id = button.closest('.lookatphoto').id;
            let filt = view.makeFilter();
            document.getElementsByTagName('body')[0].replaceChild(filt, document.getElementsByTagName('body')[0].getElementsByClassName('buttonback')[0]);
            await view.showPosts(0, 10);
            await view.showAuthors();
            await view.showHashtags();
            currentState = statesMassive.mainState;
            await view.deletePhotopost(id);
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
        //image.src = event.target.files[0].name;
    }

    async function editPostLookAtPhoto(event) {
        await view.editPostLookAtPhotoRestructure(event);
        let input = mainPlacing.getElementsByClassName('imagefileinput')[0];
        input.addEventListener('change', updateImageDisplay);
        let saveButton = document.getElementsByClassName('mainplacing')[1].lastChild;
        saveButton.addEventListener('click', view.saveEditButtonRestructure);
    }

    async function editPost(event) {
        await view.editPostRestructure(event);
        let input = mainPlacing.getElementsByClassName('imagefileinput')[0];
        input.addEventListener('change', updateImageDisplay);
        let saveButton = document.getElementsByClassName('mainplacing')[1].lastChild;
        saveButton.addEventListener('click', view.saveEditButtonRestructure);
    }

    function uploadPost(event) {
        if (currentState === statesMassive.uploadPostState) {
            return;
        }
        currentState = statesMassive.uploadPostState; //Состояние добавления фотопоста

        view.uploadPostRestructure(event);
        let input = mainPlacing.getElementsByClassName('imagefileinput')[0];
        input.addEventListener('change', updateImageDisplay);
        let uploadButton = document.getElementsByClassName('mainplacing')[1].lastChild;
        uploadButton.addEventListener('click', view.uploadButtonRestucture);
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