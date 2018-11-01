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

app.get('/game', function(request, response){
    response.render("game");
});


app.post('/game',urlencodedParser,
check('password').isLength({min:3, max: 5}).withMessage("Zle haslo"),
check('login').isLength({min: 1, max:5}).withMessage("wypelnij login"),
check('login').isAlpha().withMessage("Nei mozna cyfr"),
function(request, response){
    
    const errors = validationResult(request);
    if (!errors.isEmpty()) 
    {        
        console.log("blad");
        response.render("login",{errors: errors.array()});       
        //return response.status(422).json({ errors: errors.array() })
    }
    else
    {
    response.render("game",{dane: request.body});
    console.log(request.body);
    }  
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));