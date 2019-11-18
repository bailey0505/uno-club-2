/*************************
Responsible For Pulling in all Sql values for page 
Written by Bailey
***************************/

var mysql = require('mysql');

var sqlcredentials = require('../framework/sql.js');

exports.GetPageInfo = function(name, table, callback) {
    var arr = [];
   var conn = mysql.createConnection(sqlcredentials.connection);
    
    conn.connect(function(err) {
        if (err) {
            console.error("ERROR: cannot connect: " + err);
            return;
        }
        var sql = mysql.format("SELECT "+name+" FROM "+table+"");
        
        
        conn.query(sql, function(err, results, fields) {
           if (err) {
                console.log("sup money bag");
            } else {
              // callback = results[0];
               callback({
                   result: results[0];
               });
            }
        })
       //console.log(callback);
        conn.end();  
    }); 

  
}
                 
GetPageInfo("name", "table", function(result){
    
});               