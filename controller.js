/****************************
Router For Point Park Uno Club Website App 

Created by: Bailey, Gavin, and Tony

*****************************/



var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
const fs = require('fs');
var mysql = require('mysql');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');






var modules = require('./lib/modules.js');
var login = require('./framework/login.js');
var register = require('./framework/register.js');
var sqlcredentials = require('./framework/sql.js');
var session_key = require('./framework/session.js');

var app = express();

app.use(require('cookie-parser')(session.user));
//app.use(session({secret: SESSION_SECRET}));

app.use(express.static(__dirname + '/style'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/public')); 
app.use(express.static(__dirname + '/videos')); 


app.use(cookieParser());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));



app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.urlencoded());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
   
/*
var conn = mysql.createConnection(sqlcredentials.connection);
conn.connect(function(err) {
  if (err) {
    console.error("ERROR: cannot connect: " + err);
    return;
  }
  conn.query("SELECT * FROM users", function(err, rows, fields) {
    if (err) {
      console.error("ERROR: query failed: " + err);
      return;
    }
    console.log(JSON.stringify(rows));
  });
  conn.end();
});
*/

app.set('port', process.env.PORT || 3000);


app.get('/', function(req, res) {
    
    
 res.render('home', {
     pictures: modules.getunopics(),
     login: req.session.loggedin,
     username: req.session.username,
 });

});
app.get('/about', function(req, res) {
 res.render('about');

});
app.get('/contact', function(req, res) {
 res.render('contact');

});
app.get('/meetings', function(req, res) {
 res.render('meeting');
});

app.get('/rules', function(req, res) {
 res.render('rules');

});
app.get('/login', function(req, res) {
 res.render('login', {
     incorrect:  req.session.incoorect
 });

});
app.get('/register', function(req, res) {
 res.render('register');

});
app.get('/logout', function(req, res) {
    delete req.session.loggedin;
    res.redirect('/');

});

app.post('/auth', (req, res) => {
    //Authenticating user login
    const username = req.body.username;
    const password = req.body.password;
    
   var conn = mysql.createConnection(sqlcredentials.connection);
    conn.connect(function(err) {
    if (err) {
        console.error("ERROR: cannot connect: " + err);
        return;
    }
      var sql = mysql.format("SELECT * FROM users WHERE username=? AND password=?", [username, password]);
      console.log(sql);
    
        conn.query(sql, function(err, results, fields) {
      
        if(results.length > 0) {
            console.log('success if');
            req.session.loggedin = 'true';
            req.session.username = username;
            delete req.session.incoorect;
            res.redirect('/');
            
        }else{
         req.session.loggedin = false;
         req.session.username = '';
         req.session.incoorect = 'on';
         res.redirect('/login');
        }
     
  });
    conn.end();
});
    
});


app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});
app.use(function(err, req, res, next){
   console.log(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
 console.log( 'Express started on http://localhost:' +
 app.get('port') + '; press Ctrl-C to terminate.' );
    
});

