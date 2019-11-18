/***********************************************

    Register User For Point Park Uno Club Website. 
    Written by Bailey 

*************************************************/


//Required Content For Login 
var mysql = require('mysql');
var sqlcredentials = require('../framework/sql.js');


//start of Register user function 
exports.register = function(data, callback){
    
    var user = {
        name : data[0],
        email : data[1],
        username : data[2],
        password : data[3]
    }
    
    var conn = mysql.createConnection(sqlcredentials.connection);
    
    conn.connect(function(err) {
        if(err){
            callback("Error on our end ... Please Try again later!", null);
        }else{
             var sql = mysql.format("INSERT INTO users SET ?", user);
             console.log(sql);

            conn.query(sql, function(err, results, fields){
                //console.log(err);
                //console.log(results);
                if(err){
                    callback("Uh oh There was an error! Please Try again!", null);
                }else{
                    callback(null, "success");
                }
            
            });
        }
       conn.end(); 
    });
}