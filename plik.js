const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {check,validationResult} = require('express-validator/check');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

var conn = require('./connection');

app.set('view engine', 'ejs');

var dis = require('./sql');
app.use('/sql', dis);

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

app.get('/createtable', (req, res) => {
    var sql = 'CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))';
    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.send('Tabela stworzona');
        console.log(result);
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));