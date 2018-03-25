var eve = function() {
    function like(event) {
        var button = event.target;
        var id = button.closest('.post').id;
        dom.addLike(id);
    }

    function addMore(event) {
        dom.addMorePosts();
    }

    function login(params) {
        document.getElementsByClassName('nicknamealign')[0].innerHTML = '';
        document.getElementsByClassName('headeralign')[0].innerHTML = '';
        document.getElementsByClassName('mainplacing')[0].innerHTML = '';
        document.getElementsByClassName('mainplacing')[1].innerHTML = '';
        /////
        let body = document.getElementsByTagName('body')[0];
        let filt = body.getElementsByTagName('aside')[0];

        let backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'buttonback';
        backButton.id = 'Back';
        backButton.innerHTML = 'Back';
        backButton.addEventListener('click',
        function (event) {
            let main = document.getElementsByClassName('mainplacing')[0];
            main.innerHTML = '';
            let filt = dom.makeFilter();
            document.getElementsByTagName('body')[0].replaceChild(filt, event.target);
            dom.showPosts(0, 10);
            dom.checkLogin();
            dom.showAuthors();
            dom.showHashtags();
        })

        body.replaceChild(backButton, filt);
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
                    dom.showPosts(0, 10);
                    dom.checkLogin(users[index].login);
                    dom.showAuthors();
                    dom.showHashtags();
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

    

    return {
        like: like,
        addMore: addMore,
        login: login,
        exit: exit
    }
}();

document.getElementsByClassName('mainplacing')[1].getElementsByTagName('button')[0].addEventListener('click', eve.addMore);

document.getElementsByClassName('headeralign')[0].getElementsByTagName('button')[0].addEventListener('click', eve.login);