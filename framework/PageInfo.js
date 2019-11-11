/*************************
Responsible For Pulling in all Sql values for page 
Written by Bailey
***************************/

var mysql = require('mysql');

var sqlcredentials = require('../framework/sql.js');

exports.GetPageInfo = function(name, table, callback) {
    var arr = [];
   
    var conn = mysql.createConnection(sqlcredentials.connection);
    
   conn.connect(function(err, callback) {
        if (err) {
            console.error("ERROR: cannot connect: " + err);
            return;
        }
        var sql = mysql.format("SELECT ? FROM ?", [name, table]);
        
        sql = sql.replace(/["']/g, "");
        
        conn.query(sql, function(err, results, fields) {
           if (err) {
                console.log("sup money bag");
            } else {
               callback = results[0];
            }
        })
       console.log(callback);
        conn.end();  
    }); 

  
}
                 
                 