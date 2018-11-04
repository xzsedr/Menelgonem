const mysql = require('mysql');
const express = require('express');

var app = express.Router();

const conn = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    port     : 3306,
    database : 'Account'
});

conn.connect(function(err){
    if(err) throw err;
    else console.log('Połączenie z bazą danych');
});

module.exports = conn;

