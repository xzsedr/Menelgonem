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


app.set('view engine', 'ejs');

// var sqlconnection = require('./sql');
// app.use('/sql', sqlconnection);

app.use(express.static('Styles/'));
app.use(express.static('Scripts/'));
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




app.listen(port, () => console.log(`Example app listening on port ${port}!`));