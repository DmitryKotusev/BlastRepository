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

        let button = document.createElement('button');
        button.type = 'button';
        button.className = 'buttonback';
        button.id = 'Back';
        button.innerHTML = 'Back';
        button.addEventListener('click',
        function (event) {
            let main = document.getElementsByClassName('mainplacing')[0];
            main.innerHTML = '';
            let filt = dom.makeFilter();
            document.getElementsByTagName('body')[0].replaceChild(filt, event.target);
            dom.showPosts(0, 10);
            dom.checkLogin();
        })

        body.replaceChild(button, filt);
        //////
        let main = document.getElementsByClassName('mainplacing')[0];
        main.innerHTML = 
        `<div id="form_login_container">
            <p class="login-text">Enter your login and password</p>
            <form method='POST'>
            <input type="text" placeholder="Login" class="text_input" />
            <input type="text" placeholder="Password" class="text_input" />
            <button type="button" class="buttonlogin">Login</button>
            </form>
        </div>`;
    }

    return {
        like: like,
        addMore: addMore,
        login: login
    }
}();

document.getElementsByClassName('mainplacing')[1].getElementsByTagName('button')[0].addEventListener('click', eve.addMore);

document.getElementsByClassName('headeralign')[0].getElementsByTagName('button')[0].addEventListener('click', eve.login);