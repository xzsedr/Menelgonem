const express = require('express');
const app = new express();
const port = 3000;

app.use(express.static('Views/'));

app.get('/', function(request, response){
    response.sendfile('Views/index.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));