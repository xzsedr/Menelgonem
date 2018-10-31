const express = require('express');
const app = new express();
const port = 3000;

app.get('/', function(request, response){
    response.sendfile('index.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));