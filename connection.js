const mysql = require('mysql');

const conn = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    port     : 3306,
    database : 'Account'
});

conn.connect(function(err){
    if(err)
    {
        console.log("dblad");
        console.log(err);
    }
    else 
    {
        console.log('Połączenie z bazą danych');

    }
});
module.exports = conn;

