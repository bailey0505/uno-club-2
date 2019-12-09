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
var contact = require('./framework/contact.js');
var page = require('./framework/PageInfo.js');
var gethome = require('./framework/home.js');
//var PageVars = require('./framework/PageInfo.js');

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
   // var log = PageVars.GetPageInfo("IntroText", "HomePage");
   // console.log(log);
    // PageVars.GetPageInfo("IntroText", "HomePage", function(introtext){
        
    //});
	
		    res.render('home', {
			 pictures: modules.getunopics(),
			 login: req.session.loggedin,
			 username: req.session.username,
			 welcome : req.session.welcome,
			 FormSuccess : req.session.contactformsuccess,
			 });
	   delete req.session.contactformsuccess;
	   delete req.session.welcome;

	});

	

app.get('/about', function(req, res) {
    
    page.getabout(function(status, founded, founder, CurrentPresident, CurrentVicePresident, CurrentTreasurer, awards){
        console.log(status);
        console.log(founded);
		if(status === "success"){
			res.render('about', {
				 founded_text : founded,
				 founder_text : founder,
				 CurrentPresident_text : CurrentPresident,
				 CurrentVicePresident : CurrentVicePresident,
				 CurrentTreasurer_text : CurrentTreasurer,
				 awards_text : awards,
			});
		}else {
			res.render('about');
			
		}
    })
 });
app.get('/contact', function(req, res) {
 res.render('contact', {
     error : req.session.formerror,
 });

});
app.get('/meetings', function(req, res) {
 res.render('meeting');
});

app.get('/rules', function(req, res) {
    page.gethowtoplay(function(status, headerbig, headersmall, generalparagraph, drawtwo, reverse, skip, wildcard, wildcardplusfour){
		//console.log(headerbig);
		if(status === "success") {
			res.render('rules', {
				headerbig_text : headerbig,
				headersmall_text : headersmall,
				generalparagraph_text : generalparagraph,
				drawtwo_text : drawtwo,
				reverse_text : reverse,
				skip_text : skip,
				wildcard_text : wildcard,
				wildcardplusfour_text : wildcardplusfour,
				
			});
		}else {
			res.render('rules');
			
		}
    });
});
app.get('/login', function(req, res) {
    res.render('login', {
     incorrect:  req.session.incoorect
 });

});
app.get('/register', function(req, res) {
 res.render('register', {
    error :  req.session.error,
 });

});
app.get('/logout', function(req, res) {
    delete req.session.loggedin;
    delete req.session.welcome;
    res.redirect('/');

});

//Authenticating user login, written by bailey 
app.post('/auth', (req, res) => {
    //Grabbing Page vars
    const username = req.body.username;
    const password = req.body.password;
    var data = [username, password];
   // console.log(data);
    
    //Where loggin Happens from login framework 
    login.login(data, function(err, returned){
        console.log(returned);
        if(returned === "success"){
            delete req.session.incoorect;
            req.session.loggedin = "true";
            req.session.welcome = "Welcome " + username + "!";
            res.redirect('/');
        }else{
            ////console.log("gets here");
            delete req.session.loggedin;
            req.session.incoorect = 'true';
            res.redirect('/login');
        }
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
    
    var data = [name, email, username, password];
    //Now to process the variables to see if they are what we need. Going to check if email is an actual email and if password retype is correct 
  if(validator.isEmail(email) === false || password !== password_retype) {
      //activates session var Improper email
      req.session.error = "You Must Have mistyped something, Please Try again!";
      res.redirect('/register');
  } else{
      //deletes incorrect_email session var on second try if they do enter a correct one 
      delete req.session.incorrect_email; 
      
     register.register(data, function(err, data){
         console.log(err);
         console.log(data);
         if(data === "success"){
             req.session.loggedin = "true";
             req.session.welcome = "Welcome " + name + "!";
             res.redirect('/');
         }else{
             req.session.error = "You Must Have mistyped something, Please Try again!";
             //console.log(req.session.error);
             console.log("here");
             res.redirect('/register');
         }
    });
  }
});
//Submitting Contact Form
app.post('/submitform', (req, res) =>{
    var name = req.body.name;
    var year = req.body.year;
    var message = req.body.message;
    var date = new Date();
    
    var send = [name, year, message, date];
    
    contact.contact(send, function(data){
        console.log(data);
        if(data === "success"){
            delete req.session.formerror;
            req.session.contactformsuccess = "Your form has been submitted and we will get back to you within the next couple of days " + name;
            res.redirect('/');
        }else{
            req.session.formerror = data;
            res.redirect('/contact');
        } 
        
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

