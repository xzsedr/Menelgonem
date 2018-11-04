const express = require('express');
const mysql = require('mysql');
var app = express.Router();
var conn = require('./connection');

app.get('/select', (err, res) => {
    var sql = 'SELECT * FROM customers';
    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.send('diszwisork');
        console.log(result);
    })
})

module.exports = app;