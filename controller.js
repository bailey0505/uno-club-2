/****************************

Router For Point Park Uno Club Website App 

*****************************/


//Required package for project 
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
const fs = require('fs');
var mysql = require('mysql');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var validator = require('validator');





//Required Files that give us credentials and other data
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
 res.render('register', {
     incorrect_email :  req.session.incorrect_email
 });

});
app.get('/logout', function(req, res) {
    delete req.session.loggedin;
    res.redirect('/');

});

//Authenticating user login, written by bailey 
app.post('/auth', (req, res) => {
    //Grabbing Page vars
    const username = req.body.username;
    const password = req.body.password;
    
    //establishing sql connect using outside var for creds
   var conn = mysql.createConnection(sqlcredentials.connection);
    conn.connect(function(err) {
    if (err) {
        console.error("ERROR: cannot connect: " + err);
        return;
    }  
      //creating sql var for query, query grabs the username and passoword from sql if it is equal to user input 
      var sql = mysql.format("SELECT * FROM users WHERE username=? AND password=?", [username, password]);
      //test log to see what the qeury will be 
      //console.log(sql);
        
        conn.query(sql, function(err, results, fields) {
        //query checks if the user actually exists with that password, if yes sets the session vars and redirects them back to home page
        if(results.length > 0) {
            console.log('success if');
            req.session.loggedin = 'true';
            req.session.username = username;
            delete req.session.incoorect;
            res.redirect('/');
            
        }else{
        //happens if user has wrong password or username, activates the pop up for incorrect username or password
         req.session.username = '';
         req.session.incoorect = 'on';
         res.redirect('/login');
        }
     
  });
    conn.end();
});
    
});

//Adding new user, written by bailey 
app.post('/registeruser?', (req, res) =>{
    //Grabbing Variables from page
    var name =  req.body.name;
    var email =  req.body.email;
    var username =  req.body.username;
    var password =  req.body.password;
    var password_retype = req.body.passwordr;
    //test to see if variables were coming through
    //console.log(name + email + username + password + password_retype);
    
    //Now to process the variables to see if they are what we need. Going to check if email is an actual email and if password retype is correct 
  if(validator.isEmail(email) === false) {
      //activates session var Improper email
      req.session.incorrect_email = "on"; 
      res.redirect('/register');
  } else{
      //deletes incorrect_email session var on second try if they do enter a correct one 
     delete req.session.incorrect_email; 
    }
    
   
    
    
    
    
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

