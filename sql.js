var conn = require('./connection');

var sql = {

    existLogin: function(login, callback){
        var sql = "SELECT * FROM account WHERE login = ?";
        conn.query(sql, [login], (err, res) =>{
            if(err) throw err;
            callback(res.length != 0);
        });
    },
    
    existEmail: function(email, callback){
        var sql = 'SELECT * FROM account WHERE email = ?';
        conn.query(sql, [email], (err, res) =>{
            if(err) throw err;
            callback(res.length != 0);
        })
    },

    getData: function(login, callback){
        var sql = 'SELECT * FROM account WHERE login = ?';
        conn.query(sql, [login], (err, res) =>{
            if(err) throw err;
            callback(res);
        })
    }

};

module.exports = sql;