const express = require('express');
var app = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    //database : 'Account.sql'
});

db.connect((err) => {
    if(err) throw err;
    console.log('Połączenie z bazą danych');
});

app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE Account';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Baza stworzona');
    });
});

module.exports = app;
