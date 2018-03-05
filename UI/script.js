function Photopost (id, description, createdAt, author, photolink, likes, hashtags)
{
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
    this.likes = likes || [];
    this.hashtags = hashtags || [];
}
var photoPosts = [
    new Photopost("1", "description1", new Date("2018-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("2", "description2", new Date("2018-02-26T23:00:00"), "Vova", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("3", "description3", new Date("2018-02-26T23:00:00"), "Petia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("4", "description4", new Date("2018-02-26T23:00:00"), "Dima", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("5", "description5", new Date("2018-01-18T12:33:50"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("6", "description6", new Date("2018-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("7", "description7", new Date("2018-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("8", "description8", new Date("2018-03-14T15:00:09"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("9", "description9", new Date("2018-03-14T22:10:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("10", "description10", new Date("2018-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("11", "description11", new Date("2018-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("12", "description12", new Date("2018-02-26T23:00:00"), "Dima", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("13", "description13", new Date("2017-10-11T23:07:11"), "Kolia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("14", "description14", new Date("2018-02-26T23:00:00"), "Vova", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("15", "description15", new Date("2018-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("16", "description16", new Date("2018-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("17", "description17", new Date("2018-02-26T23:00:00"), "Anastasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("18", "description18", new Date("2018-02-28T12:32:01"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("19", "description19", new Date("2018-02-26T23:00:00"), "Magamed", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("20", "description20", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"])
]
//(function()
//{
    function datesort(a, b)
    {
        var dif = a.createdAt - b.createdAt;
        if (dif > 0) {
            return 1;
        }
        if (dif < 0) {
            return -1;
        }
        return 0;
    }
    function getPhotoPosts(skip, top, filterConfig)//: Array<Object>
    {
        skip = skip || 0;
        if (typeof(skip) !== "number") {
            skip = 0;
        }
        top = top || 10;
        if (typeof(top) !== "number") {
            top = 0;
        }
        photoPosts.sort(datesort);
        //Тут ещё будет фильтр
        if (typeof(filterConfig) !== "undefined") {
            function filtfunc(param)
        {
            if (filterConfig.author !== undefined) {
                if (typeof(filterConfig.author) === "string") {
                    if (filterConfig.author !== param.author) {
                        return false;
                    }   
                }
            }
            if (filterConfig.createdAt !== undefined) {
                if (typeof(filterConfig.createdAt) === "object") {
                    if (filterConfig.createdAt.getFullYear() !== param.createdAt.getFullYear() || filterConfig.createdAt.getMonth() !== param.createdAt.getMonth() || filterConfig.createdAt.getDate() !== param.createdAt.getDate()) {
                        return false;
                    }   
                }
            }
            if (filterConfig.hashtags !== undefined) {
                if (typeof(filterConfig.hashtags) === "object")
                {
                    for (var index = 0; index < filterConfig.hashtags.length; index++) {
                        var flag = false;
                        for (var index2 = 0; index2 < param.hashtags.length; index2++) {
                            if (param.hashtags[index2] !== filterConfig.hashtags[index]) {
                                flag = true;
                                break;
                            }
                        }
                        if (!flag) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        var buffmass1 = photoPosts.filter(filtfunc);//фильтрация
        }
        else
        {
            var buffmass1 = photoPosts;
        }
        var buffmass2 = buffmass1.slice(skip, skip + top);//отбрасывание первых skip элементов массива и взятие последующих top элементов
        return buffmass2;
    }
    function getPhotoPost(id)//: object
    {
        for (var index = 0; index < photoPosts.length; index++) {
            if (photoPosts[index].id === id) {
                return photoPosts[index];
            }
        };
    }
    function validatePhotoPost(photoPost)//: boolean
    {
        if (typeof(photoPost.id) !== "string" || typeof(photoPost.description) !== "string" || typeof(photoPost.author) !== "string" || typeof(photoPost.photolink) !== "string") {
            return false;
        }
        if (photoPost.description.length >= 200) {
            return false;
        }
        if (photoPost.createdAt == "Invalid Date") {
            return false;
        }
        if (!(Array.isArray(photoPost.likes))) {
            return false;
        }
        if (!(Array.isArray(photoPost.hashtags))) {
            return false;
        }
        function validhash(item)
        {
            if (item.charAt(0) !== "#") {
                return false;
            }
            for (let index = 1; index < item.length; index++) {
                if (item.charAt(index) === " ") {
                    return false;
                }
            }
            return true;
        }
        function isstring(item)
        {
            return (typeof(item) === "string");
        }
        if(!photoPost.hashtags.every(validhash))
        {
            return false;
        }
        if(!photoPost.hashtags.every(isstring))
        {
            return false;
        }
        for (var index = 0; index < photoPosts.length; index++) {
            if (photoPosts[index].id === photoPost.id) {
                return false;
            }
        }
        return true;
    }
    function addPhotoPost(photoPost)//: boolean
    {
        if (validatePhotoPost(photoPost)) {
            photoPosts.push(photoPost);
            return true;
        }
        else
        {
            return false;
        }
    }
    function editPhotoPost(id, photoPost)//: boolean
    {

    }
    function removePhotoPost(id)//: boolean
    {
        if (typeof(id) === "string") {
            for (var index = 0; index < photoPosts.length; index++) {
                if (photoPosts[index].id === id) {
                    photoPosts.splice(index, 1);
                    return true;
                }
            }
        }
        else
        {
            return false;
        }
    }
//}())
/////////////////////Проверки//////////////////////////////////////////////////////////////////////
var ob = getPhotoPost("4");
console.log(ob);
var ob1 = new Photopost("20", "description20", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
console.log(ob1);
console.log(validatePhotoPost(ob1));
console.log(getPhotoPosts(0, 10));
console.log(getPhotoPosts(0, 10, {author: "Dima"}));
console.log(removePhotoPost("3"));
console.log(removePhotoPost(5));
console.log(addPhotoPost(new Photopost("3", "description20", new Date("2016-03-16T02:20:00"), "Kolia", "link", ["Vasia", "Petia"], ["#summer", "#2018"])));
console.log(photoPosts);
console.log(getPhotoPosts(0, 21));