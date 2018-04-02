var http = require("http");
var fs = require("fs");
 
http.createServer(function(request, response){
     
    console.log(`Requested adress: ${request.url}`);
    if(request.url.startsWith("/public/UI/")){
         
        // получаем путь после слеша
        var filePath = request.url.substr(1);
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