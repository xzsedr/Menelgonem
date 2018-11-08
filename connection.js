const mysql = require('mysql');
const express = require('express');


const conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    port     : 3306,
    database : 'menelgonem'
});

conn.connect(function(err){
    if(err) throw err;
    else console.log('Połączenie z bazą danych');
});

module.exports = conn;

