function Photopost (id, description, createdAt, author, photolink)
{
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
}
var photoPosts = [
    new Photopost("1", "description1", new Date("2018-02-26T23:00:00"), "Vasia", "link"),
    new Photopost("2", "description2", new Date("2018-02-26T23:00:00"), "Vova", "link"),
    new Photopost("3", "description3", new Date("2018-02-26T23:00:00"), "Petia", "link"),
    new Photopost("4", "description4", new Date("2018-02-26T23:00:00"), "Dima", "link"),
    new Photopost("5", "description5", new Date("2018-01-18T12:33:50"), "Vasia", "link"),
    new Photopost("6", "description6", new Date("2018-02-26T23:00:00"), "Vasia", "link"),
    new Photopost("7", "description7", new Date("2018-02-26T23:00:00"), "Vasia", "link"),
    new Photopost("8", "description8", new Date("2018-03-14T15:00:09"), "Vasia", "link"),
    new Photopost("9", "description9", new Date("2018-03-14T22:10:00"), "Vasia", "link"),
    new Photopost("10", "description10", new Date("2018-02-26T23:00:00"), "Vasia", "link"),
    new Photopost("11", "description11", new Date("2018-02-26T23:00:00"), "Vasia", "link"),
    new Photopost("12", "description12", new Date("2018-02-26T23:00:00"), "Dima", "link"),
    new Photopost("13", "description13", new Date("2017-10-11T23:07:11"), "Kolia", "link"),
    new Photopost("14", "description14", new Date("2018-02-26T23:00:00"), "Vova", "link"),
    new Photopost("15", "description15", new Date("2018-02-26T23:00:00"), "Vasia", "link"),
    new Photopost("16", "description16", new Date("2018-02-26T23:00:00"), "Vasia", "link"),
    new Photopost("17", "description17", new Date("2018-02-26T23:00:00"), "Anastasia", "link"),
    new Photopost("18", "description18", new Date("2018-02-28T12:32:01"), "Vasia", "link"),
    new Photopost("19", "description19", new Date("2018-02-26T23:00:00"), "Magamed", "link"),
    new Photopost("20", "description20", new Date("2018-03-14T16:20:00"), "Vasia", "link")
]
(function()
{
    function getPhotoPosts(skip, top, filterConfig)//: Array<Object>
    {
        if(skip === undefined)
        {
            var skip = 0;
        }
        if(top === undefined)
        {
            var top = 10;
        }
        
    }
    function getPhotoPost(id)//: object
    {

    }
    function validatePhotoPost(photoPost)
    {

    }
    function addPhotoPost(photoPost)//: boolean
    {

    }
    function editPhotoPost(id, photoPost)//: boolean
    {

    }
    function removePhotoPost(id)//: boolean
    {

    }
}())