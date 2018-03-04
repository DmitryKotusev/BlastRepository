function Photopost (id, description, createdAt, author, photolink)
{
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
}
var photoPosts = [
    new Photopost("1", "description", new Date(), "Vasia", "link"),
    new Photopost("2", "description", new Date(), "Vasia", "link"),
    new Photopost("3", "description", new Date(), "Vasia", "link"),
    new Photopost("4", "description", new Date(), "Vasia", "link"),
    new Photopost("5", "description", new Date(), "Vasia", "link"),
    new Photopost("6", "description", new Date(), "Vasia", "link"),
    new Photopost("7", "description", new Date(), "Vasia", "link"),
    new Photopost("8", "description", new Date(), "Vasia", "link"),
    new Photopost("9", "description", new Date(), "Vasia", "link"),
    new Photopost("10", "description", new Date(), "Vasia", "link"),
    new Photopost("11", "description", new Date(), "Vasia", "link"),
    new Photopost("12", "description", new Date(), "Vasia", "link"),
    new Photopost("13", "description", new Date(), "Vasia", "link"),
    new Photopost("14", "description", new Date(), "Vasia", "link"),
    new Photopost("15", "description", new Date(), "Vasia", "link"),
    new Photopost("16", "description", new Date(), "Vasia", "link"),
    new Photopost("17", "description", new Date(), "Vasia", "link"),
    new Photopost("18", "description", new Date(), "Vasia", "link"),
    new Photopost("19", "description", new Date(), "Vasia", "link"),
    new Photopost("20", "description", new Date(), "Vasia", "link")
]
alert(photoPosts.length);