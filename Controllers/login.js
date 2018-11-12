// poniższy kod sprawdza czy uzytkownik podał prawidłowe dane, a jesli je podał
// to zwraca informacje o użytkowniku oraz tworzy nową sesję

const express = require('express');
const app = express.Router();
const bodyParser = require('body-parser');
const {check,validationResult} = require('express-validator/check');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const flash = require('connect-flash');
const crypto = require('crypto');
var session = require('express-session');
app.use(session({
    secret: 'max',
    resave: true,
    saveUninitialized: true
  }));
app.use(flash());

var conn = require('../connection');
var sql = require('../sql');



app.post('/login',urlencodedParser,function (request,response){
    console.log("Wpisane: " + request.body.login);
    var query = new Promise((resolve) =>{
        sql.getData(request.body.login, (res) =>{
            resolve(res);
        })
    });
    query.then((result) =>{
        if(result.length != 0)
        {
            console.log("Znaleziono użytkownika.");
            console.log("Jego dane to: " + result[0].login);
            //tutaj sprawdzę czy wprowadzone haslo jest prawidlowe
            var sha512 = function(password, salt){
                var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
                hash.update(password);
                var value = hash.digest('hex');
                return {
                    salt:salt,
                    passwordHash:value
                };
            };
            var salt = result[0].salt;
            var passwordData = sha512(request.body.password, salt);
            var hashed = passwordData.passwordHash;
            if(hashed==result[0].password)
            {              
                request.session.login = result[0].login;
                response.redirect("game");
                //console.log(request.session); 
            }
            else
            {
                //console.log("Nie ma takiego użytkownika!");
                var error = "Zły login lub hasło";
                request.flash('error', error);
                response.redirect('login'); 
            }

        }
        else
        {
            //console.log("Nie ma takiego użytkownika!");
            var error = "Zły login lub hasło";
            request.flash('error', error);
            response.redirect('login'); 
        }
    })
});

module.exports = app;