//poniższy kod odpowiada za walidację formularza rejestracyjnego
// i wprowadzenie danych do bazy

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

app.post('/register',urlencodedParser,
check('password').isLength({min:1, max: 10}).withMessage("Wypelnij pole hasło"),
check('login').isLength({min: 1, max:10}).withMessage("Login musi zawierać min 3 znaki"),
check('email').isEmail().withMessage("Podano nieprawidłowy email"),
check('password2','Hasła nie są jednakowe').custom((value, {req}) => {
    return value == req.body.password;   
  }),
check('login','Ork Dis ukradł ci login, wybierz inny.').custom((login) => {
    var query = new Promise((resolve) =>{
        sql.getData(login, (res) =>{
            resolve(res.length != 0);
        })
    });
    return query.then((exist) =>{
        return !exist;
    });
}),
check('email','Ork Dis ukradł ci email, wybierz inny.').custom((email) => {
    var query = new Promise((resolve) =>{
        sql.existEmail(email, (exist) =>{
            resolve(exist);
        })
    });
    return query.then((exist) =>{
        return !exist;
    });
}),
function(request, response){
    const errors = validationResult(request);
    if (!errors.isEmpty()) 
    {        
        console.log(errors.array());   
        request.flash('errors', errors.array()); 
        response.redirect('register');   
    }
    else
    {
        //tu bede szyfrował dane, sprawdzał czy nie ma SQL injection oraz hashował hasła
        
        //krok1.generuje sól
        var generateSalt = function(length){
            return crypto.randomBytes(Math.ceil(length/2))
                    .toString('hex') /** convert to hexadecimal format */
                    .slice(0,length);   /** return required number of characters */
        };
        //krok2.hasuje hasło algorytmem sha512
        var sha512 = function(password, salt){
            var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
            hash.update(password);
            var value = hash.digest('hex');
            return {
                salt:salt,
                passwordHash:value
            };
        };
        
        var salt = generateSalt(16); /** Gives us salt of length 16 */
        var passwordData = sha512(request.body.password, salt);
        console.log('Hasło = '+request.body.password);
        console.log('Haslo zahashowane = '+passwordData.passwordHash);
        var hashed = passwordData.passwordHash;
        console.log('Salt = '+passwordData.salt);
        var uniquesalt = passwordData.salt;

        var sql = 'INSERT INTO account SET ?';
        var values = {login: request.body.login, email: request.body.email, salt: uniquesalt, password: hashed};        
        conn.query(sql,values ,(err, res) => {
            if(err) console.log(err);
            else
            {
            console.log("Dodano!");
            console.log(values);
            var success = "Zarejestrowano pomyślnie!";
            request.flash('success', success);
            response.redirect('register');  
            }
        });  
    }
});

module.exports = app;