const express = require('express');
var app = express.Router();
var conn = require('./connection');

app.get('/select', (err, res) => {
    var sql = 'SELECT * FROM account';
    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        //conn.destroy();
    })
});


module.exports = app;