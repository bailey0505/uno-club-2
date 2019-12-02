/*************************

This file is responsible for writing the contact form to the database


*************************/

//REQUIRED
var mysql = require('mysql');
var sqlcredentials = require('../framework/sql.js');
    

exports.contact = function(data, callback) {
    console.log(data);
    
    var sqldata = {
        name : data[0], 
        StudentYear : data[1],
        message : data[2],
        date : data[3],
    }
    
    var conn = mysql.createConnection(sqlcredentials.connection);
    
    conn.connect(function(err) {
        if(err){
            callback("Error on our end ... Please Try again later!");
        }else{
            var sql = mysql.format("INSERT INTO forms SET ?", sqldata);
            //console.log(sql);
            
            conn.query(sql, function(err, results, fields){
                console.log(results);
                
                if(results) {
                    callback("success");
                }else{
                    callback("There was an error, Please Try again!");
                }
            });
        }
    
    });
}
