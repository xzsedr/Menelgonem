const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {check,validationResult} = require('express-validator/check');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const session = require('express-session'); // do trzymania danych jak uda nam sie zalogowac
const flash = require('connect-flash'); //do wyswietlania komunikatow
const crypto = require('crypto'); // do hashowania


var conn = require('./connection');
var sql = require('./sql');

app.set('view engine', 'ejs');

// var sqlconnection = require('./sql');
// app.use('/sql', sqlconnection);

app.use(express.static('Styles/'));
app.use(express.static('Scripts/'));
app.use(session({
    secret: 'max',
    resave: true,
    saveUninitialized: true
  }));
  app.use(flash());

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
    response.render('register', { success: request.flash('success'),errors: request.flash('errors')});
});

app.post('/register',urlencodedParser,
check('password').isLength({min:3, max: 5}).withMessage("Wypelnij pole hasło"),
check('login').isLength({min: 1, max:5}).withMessage("Login musi zawierać min 3 znaki"),
check('email').isEmail().withMessage("Podano nieprawidłowy email"),
check('password2','Hasła nie są jednakowe').custom((value, {req}) => {
    return value == req.body.password;   
  }),
check('login','Ork Dis ukradł ci login, wybierz inny.').custom((login) => {
    var query = new Promise((resolve) =>{
        sql.existLogin(login, (exist) =>{
            resolve(exist);
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

app.post('/log',urlencodedParser,function (request,response){
    console.log("Wpisane: " + request.body.login);
    var query = new Promise((resolve) =>{
        sql.existLogin(request.body.login, (exist) =>{
            resolve(exist);
        })
    });
    query.then((exist) =>{
        if(exist){
            console.log("Znaleziono użytkownika.");
            console.log("Jego dane to: " + result[0].login);
            request.session.login = request.body.login;
            console.log(request.session.login);
            response.render('header', {login: request.session.login});
            response.render("game");
        }
        else{
            console.log("Nie ma takiego użytkownika");
            var msg = "Zle dane";
            response.render("login",{errors: msg});
        }
    }).catch((err) => {
        console.log(err);
    })
    //if(request.body.login==request.session.login)console.log("najs!");
    //else console.log("dis");
    // console.log("das");
    // console.log(request.body);
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`));