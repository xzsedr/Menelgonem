const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {check,validationResult} = require('express-validator/check');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const cookieParser = require('cookie-parser');
var session = require('express-session'); // do trzymania danych jak uda nam sie zalogowac
const flash = require('connect-flash'); //do wyswietlania komunikatow
const crypto = require('crypto'); // do hashowania


var conn = require('./connection');
var sql = require('./sql');
var reg = require('./Controllers/register');
var login = require('./Controllers/login');


app.set('view engine', 'ejs');

// var sqlconnection = require('./sql');
// app.use('/sql', sqlconnection);

app.use(express.static('Styles/'));
app.use(express.static('Scripts/'));
app.use(reg,login);
app.use(cookieParser());
app.use(session({
    secret: 'max',
    resave: true,
    saveUninitialized: true
  }));
app.use(flash());

app.get('/', function(request, response){
    // response.sendFile(__dirname + '/Views/index.html');
    // console.log("Tak wyglada sesja" + request.session);
    // console.log("Są dane: " + request.session.login);
    if(request.session.login)response.render("index",{session : request.session});
    else response.render("index");
});


app.get('/druga', function(request, response){
    // response.sendFile(__dirname + '/Views/druga.html');
    if(request.session.login)response.render("druga",{session : request.session});
    else response.render("druga");
});

app.get('/login', function(request, response){
    // console.log("Tak wyglada sesja" + request.session);
    // console.log("Są dane 1231231: " + request.session.login);
    if(request.session.login)response.render('login', {error: request.flash('error'),session : request.session});
    else response.render("login", {error: request.flash('error')});
});

app.get('/logout', function(request, response){   
    request.session.destroy();
    response.redirect("login");
});

app.get('/test', function(request, response){
    response.render("test");
});

app.get('/game', function(request, response){
    if(request.session.login)response.render("game",{session : request.session});
    else response.render("game");
});

app.get('/register', function(request, response){
    if(request.session.login)response.render('register', { success: request.flash('success'),errors: request.flash('errors'),session : request.session});
    else response.render("register",{ success: request.flash('success'),errors: request.flash('errors')});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
module.exports = app;