
var mysql = require('mysql');
var sqlcredentials = require('../framework/sql.js');

exports.getwinners = function(callback) {
	//code here


		var conn = mysql.createConnection(sqlcredentials.connection);

		conn.connect(function(err) {
				if(err){
						callback("Error on our end ... Please Try again later!");
				}else{
						var sql = mysql.format("SELECT * FROM tourament_dates");
						//console.log(sql);

						conn.query(sql, function(err, results, fields){
								console.log(results);

								if(results) {
										var First= results[0]['First'];
										var MidFall= results[0]['Mid-Fall'];
										var Spooky= results[0]['Spooky'];
										var BSUPartnered= results[0]['BSU-Partnered'];
										var FallSemester= results[0]['Fall-Semester'];
										callback("success", First, MidFall, Spooky, BSUPartnered, FallSemester)
								}else{
										callback("There was an error, Please Try again!");
								}
						});
				}
				conn.end();
		});

}
