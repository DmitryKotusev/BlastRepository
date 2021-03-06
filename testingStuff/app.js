var http = require("http");
var fs = require("fs");
 
http.createServer(function(request, response){
     
    console.log(`Requested adress: ${request.url}`);
    if(request.url.startsWith("/")){
        var filePath;
        if (request.url === '/') {
            filePath = "../public/UI/index.html";  
        }
        else {
            filePath = '../public/UI/' + request.url;
        }
        //request.url += "public/UI/index.html";
        // получаем путь после слеша
        //var filePath = request.url.substr(1);
        fs.readFile(filePath, function(error, data){
                 
            if(error){
                     
                response.statusCode = 404;
                response.end("No data found!");
            }   
            else{
                response.end(data);
            }
            return;
        })
    }
    else{
        response.end("Invalid path");
    }
}).listen(3000);