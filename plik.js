const express = require('express');
const app = new express();
const port = 3000;
const bodyParser = require('body-parser');
const {check,validationResult} = require('express-validator/check');

//srednio rozumiem czemu musi tak być
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.set('views', __dirname + '/Views');

app.use(express.static('Styles/'));
app.use(express.static('Scripts/'));

app.get('/', function(request, response){
    // response.sendFile(__dirname + '/Views/index.html');
    response.render("index");
});

app.get('/druga', function(request, response){
    // response.sendFile(__dirname + '/Views/druga.html');
    response.render("druga");
});

app.get('/login', function(request, response){
    response.render("login");
});

app.get('/test', function(request, response){
    response.render("test");
});


app.post('/test',
[check('password').isLength({min: 10}),
check('login').isLength({min: 5})],
urlencodedParser,function(request, response){
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }
    response.render("test",{dane: request.body});
    console.log(request.body);  
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));