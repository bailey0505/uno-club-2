/***********************************************

    Login For Point Park Uno Club Website. 
    Written by Bailey 

*************************************************/


//required for Login 
var mysql = require('mysql');
var sqlcredentials = require('../framework/sql.js');

//Start of Login function 
exports.login = function(data, callback){
    var conn = mysql.createConnection(sqlcredentials.connection);
        //Start of Sql Connection
        conn.connect(function(err) {
        //If there is an error on our end or sql is down ...
        if (err) {
            //console.log("here")
            callback("There was an error on Our end, Try again Later!", "error");
        }else{
            //sql query string
            var sql = mysql.format("SELECT * FROM users WHERE username='"+data[0]+"' AND password='"+data[1]+"'");
           // console.log(sql);
            //Start of query 
             conn.query(sql, function(err, results, fields) {
                 //console.log(results);
                 if(results.length === 0){
                     //console.log('here')
                     callback("Uh oh, Username or password is incorrect", "error");
                 }
                 //console.log(results);
                 //query checks if the user actually exists with that password, if yes sets the session vars and redirects them back to home page
                 if(results.length > 0) {
                     //console.log("Success!")
                    callback(null, "success");
                   
                }   
             conn.end();
             });
        
        } 
    });
   
};
