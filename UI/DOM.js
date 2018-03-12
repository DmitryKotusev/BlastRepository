
var skip0 = 0;       //Данное поле хранит количество записей, которое нужно было пропустить в последний раз 
var top0 = 0;        //Данное поле хранит количество записей, которое нужно было вывести на экран в последний раз
var filterConfig0;   //Данный объект хранит параметры фильтрации, которые были применены в последний раз

var dom = function() {
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

    function showHashtags() {
        var elem = document.getElementById("filterselectors");
        elem.innerHTML = "";
        findUniqueHashtags();
        for (let index = 0; index < hashtags.length && index < 10; index++) {
            var option = document.createElement("option");
            option.innerHTML = hashtags[index];
            elem.appendChild(option);
        }
    }

    function checklogin(username) {
        var islogined = (username !== undefined);
        if(islogined)
        {
            document.getElementsByClassName("nicknamealign")[0].innerHTML = "<p>" + username + "</p>";
            document.getElementsByClassName("headeralign")[0].innerHTML = "<button type=\"button\" class=\"buttonusual\">" +
            "Add photo</button>" +
            "<button type=\"button\" class=\"buttonusual\">Exit</button>";
        }
        else
        {
            document.getElementsByClassName("nicknamealign")[0].innerHTML = "";
            document.getElementsByClassName("headeralign")[0].innerHTML = "<button type=\"button\" class=\"buttonusual\">Login</button>";
        }
    }

    function showphotopost(post0) {
        var main = document.getElementsByClassName("mainplacing")[0];
        
        var post = document.createElement("div");
        post.className = "post";
        
        var photo = document.createElement("div");
        photo.className = "photo";
        photo.innerHTML = "<img class=\"imgstyle\" src=\"" + post0.photolink + "\" alt=\"Mat\">";
        
        var nick = document.createElement("div");
        nick.className = "nickandicons";
        nick.innerHTML = post0.author;

        var icons = document.createElement("div");
        icons.className = "nickandicons";
        icons.innerHTML = 
        "<button type=\"button\" class=\"buttonset\"><img class=\"iconstyles\" src=\"../ImagesAndIcons/delete-512.png\" alt=\"Bin\"></button>" +
        "<button type=\"button\" class=\"buttonset\"><img class=\"iconstyles\" src=\"../ImagesAndIcons/221649.png\" alt=\"Edit\"></button>" +
        "<button type=\"button\" class=\"buttonset\"><img class=\"iconstyles\" src=\"../ImagesAndIcons/comments.png\" alt=\"Bin\"></button>" +
        "<button type=\"button\" class=\"buttonset\"><img class=\"iconstyles\" src=\"../ImagesAndIcons/filled-like.png\" alt=\"Bin\"></button>";
        
        var date = document.createElement("div");
        date.className = "date";
        date.innerHTML = getformatDate(post0);

        //Объявление элементов завершено, приступаем к связыванию и добавлению в дерево

        post.appendChild(photo);
        post.appendChild(nick);
        post.appendChild(icons);
        post.appendChild(date);

        main.appendChild(post);
    }

    function getformatDate(post) {
        var date = post.createdAt;

        var day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        }

        var month = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }

        var year = date.getFullYear();

        return day + "." + month + "." + year;
    }

    function addphotopost(photopost) {
        return module.addPhotoPost(photopost);
    }

    function deletephotopost(id) {
        return module.removePhotoPost(id);
    }

    function editpost(id, photoPost) {
        return module.editPhotoPost(id, photoPost);
    }

    return {
        showphotopost: showphotopost,
        checklogin: checklogin,
        addphotopost: addphotopost,
        deletephotopost: deletephotopost,
        editpost: editpost,
        showHashtags: showHashtags
    }
}();

function login(username)
{
    dom.checklogin(username);
}

//Функция отображает фотопосты (укзанное количество с указанного места с указанными фильтрами)
function showPosts(skip, top, filterConfig) {
    document.getElementsByClassName("mainplacing")[0].innerHTML = "";
    var photoPosts = module.getPhotoPosts(skip, top, filterConfig);

    if (photoPosts === undefined) {
        return;
    }

    for (var i = 0; i < photoPosts.length; i++)
    {
        dom.showphotopost(photoPosts[i]);
    }
    skip0 = skip;
    top0 = top;
    filterConfig0 = filterConfig;
}

//Добавляет фотопост, после чего обновляет список выведенных фотопостов, если вставка прошла успешно
function addPost(photopost) {
    if (dom.addphotopost(photopost)) {
        showPosts(skip0, top0, filterConfig0);    
    }
}

//Удалаяет фотопост, после чего обновляет список выведенных фотопостов, если удаление прошло успешно
function deletePost(id) {
    if(dom.deletephotopost(id)) {
        showPosts(skip0, top0, filterConfig0);
    }
}

//Изменеяет фотопост, после чего обновляет список выведенных фотопостов, если редактирование прошло успешно
function editpost(id, photoPost) {
    if (dom.editpost(id, photoPost)) {
        showPosts(skip0, top0, filterConfig0);
    }
}

function showHashtags(){//Отображает список возможных хештегов, но не более 10
    dom.showHashtags();
}

//editpost("9", {description: "Hello, world!!!", photolink: "", likes: ["Vasia", "Kolia"], hashtags: ["#2018", "wronghash", "#NewYear"]});
//showposts(0, 10);
//showposts(10, 1);
//showHashtags();