const express = require('express');
const app = new express();
const port = 3000;

app.use(express.static('../Views/'));

app.get('/', function(request, response){
    response.sendfile('index.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// const http = require('http');
// const fs = require('fs');


// http.createServer(function(request, response) {  

    
//     fs.readFile('../Views/index.html', function (err, html) {
//     response.writeHeader(200, {"Content-Type": "text/html"});  
//     response.write(html);              
//     response.end(); 
// });
     
// }).listen(8000); 



