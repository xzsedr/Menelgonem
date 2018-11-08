const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {check,validationResult} = require('express-validator/check');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const session = require('express-session');


var conn = require('./connection');

app.set('view engine', 'ejs');

var dis = require('./sql');
app.use('/sql', dis);
app.use(express.static('Styles/'));
app.use(express.static('Scripts/'));
app.use(session({
    secret: 'max',
    resave: false,
    saveUninitialized: false
  }));

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

app.get('/logout', function(request, response){
    response.render("logout");
});

app.get('/test', function(request, response){
    response.render("test");
});

app.get('/game', function(request, response){
    response.render("game");
});

app.get('/register', function(request, response){
    response.render("register",{success: request.session.success});
    console.log(request.session.success);
    request.session.errors = null;
    request.session.success = null;
});



app.post('/register',urlencodedParser,
check('password').isLength({min:3, max: 5}).withMessage("Wypelnij pole hasło"),
check('login').isLength({min: 1, max:5}).withMessage("Login musi zawierać min 3 znaki"),
check('email').isEmail().withMessage("Podano nieprawidłowy email"),
check('password2','Hasła nie są jednakowe').custom((value, { req }) => {
    return value == req.body.password;   
  }),
function(request, response){
    //console.log(request.body);
    const errors = validationResult(request);
    if (!errors.isEmpty()) 
    {        
        console.log("Bledne dane");
        response.render("register",{errors: errors.array()});  
        console.log(errors.array());     
    }
    else
    {
        var sql = 'INSERT INTO account SET ?';
        //tu bede szyfrował dane, sprawdzał czy nie ma SQL injection oraz hashował hasła



        var values = {login: request.body.login, email: request.body.email, password: request.body.password};        
        conn.query(sql,values ,(err, result) => {
            if(err) console.log(err);
            else
            {
            console.log("Dodano!");
            console.log(values);
            var success = "Zarejestrowano pomyślnie!";
            request.session.success = success;
            response.redirect('register');  
            //response.render("register",{success: success});
            //response.end();
            //response.write(success);
            //request.flash('success', 'you are registered');
            //console.log("dasdasdasd" + request.flash().success);
            //response.render("register",{success: success}); 
            //conn.destroy();
            }
        });
    }
});



app.post('/log',urlencodedParser,function (request,response){
    console.log("Wpisane:" + request.body.login);
    //console.log("Z bazy danych: " + request.session.login);
    var sql = 'SELECT * FROM account WHERE login = ?';
    var value = request.body.login;
    conn.query(sql,value,(err, result) => {
        if(err)console.log("BLAD");
        else{
           
            if(result.length > 0)
            {
            console.log("Znaleziono użytkownika");
            console.log("Jego dane to: " + result[0].login);
            request.session.login = request.body.login;
            console.log(request.session.login);
            response.render('header', {login: request.session.login});
            response.render("game");
            //response.send("*",{islogged: true});
            }
            else
            {
                console.log("Nie ma takiego użytkownika");
                var msg = "Zle dane";
                response.render("login",{errors: msg});
            }
        }
        //console.log(result);
    });
    //if(request.body.login==request.session.login)console.log("najs!");
    //else console.log("dis");
    // console.log("das");
    // console.log(request.body);
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`));