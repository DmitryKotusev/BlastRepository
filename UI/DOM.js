var dom = function() {
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

    function showphotopost(post) {
        var main = document.getElementsByClassName("mainplacing")[0];
        var post = document.createElement("div");
        post.className = "post";
        var photo = document.createElement("div");
        photo.className = "nickandicons";
        var icons = document.createElement("div");
        icons.className = "nickandicons";
        var date = document.createElement("div");
        date.className = "date"; 
    }

    return {
        checklogin: checklogin
    }
}();