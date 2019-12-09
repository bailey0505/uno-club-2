/***************************

Fraemwork For Pulling in page variables from mongo

***************************/
/*
  page: 'aboutpage',
  founded: 'Fall of 2018',
  founder: 'Bryan Partika',
  CurrentPresident: 'Carlos Polanco',
  CurrentVicePresident: 'Justin Joyce',
  CurrentTreasurer: 'Kimberly Staments',
  awards: '2018-2019 new club of the year'
*/

var MongoClient = require('mongodb').MongoClient;

exports.getabout = function(callback){
    //console.log("here");
    MongoClient.connect("mongodb://localhost:27017/", function (err, db) {
        if(err){
            //console.log("Errored");
            callback("err");
        }else{
            //console.log("success");
            var dbo = db.db("UnoClub");
            var query = { page : "aboutpage" };
            
             dbo.collection("about").find(query).toArray(function(err, results){
                 if(err){
                     console.log("err");
                     db.close();
                 }else{
                   // console.log("Successful Query")
                    //console.log(results[0]);
                    var founded = results[0]['founded'];
                    var founder = results[0]['founder'];
                    var CurrentPresident = results[0]['CurrentPresident'];
                    var CurrentVicePresident = results[0]['CurrentVicePresident'];
                    var CurrentTreasurer = results[0]['CurrentTreasurer'];
                    var awards = results[0]['awards'];
                     
                    callback("success", founded, founder, CurrentPresident, CurrentVicePresident, CurrentTreasurer, awards);
                    
                    db.close();
                }
            });
        }
    });
}

/********
{
  _id: 5dea5f9c13b70e518d23516a,
  page: 'HowToPlay',
  headerbig: 'How To Play',
  headersmall: 'General',
  generalparagraph: 'Be the first to play all of your cards You many stack similar colors on the pile or similar numbers You may stack as many of the same number on top of itself as long as you have the correct number or color underneath You can stack draw 2s onto each other You can stack draw 4s onto each other You may not stack draw 2s and draw 4s on each other Reverse cards act as skip cards when there are two people You must call UNO when you have one card left If another person calls you out for not saying UNO with one card left you must draw 2',
  drawtwo: 'Force the next person to draw two',
  reverse: 'Rotate the order of people playing',
  skip: 'Skip the next person',
  wildcard: 'Change the current color',
  wildcardplusfour: 'Change the color and force the next person to draw 4'
}



********/

exports.gethowtoplay = function(callback) {
    MongoClient.connect("mongodb://localhost:27017/", function (err, db) {
        if(err){
            callback("err");
        }else {
            var dbo = db.db("UnoClub");
            var query = { page : "HowToPlay" };
            
            dbo.collection("howtoplay").find(query).toArray(function(err, results){
                if(err){
                    callback("err");
                    db.close();
                }else{
                    //console.log(results[0]);
                    var headerbig = results[0]['headerbig'];
                    var headersmall = results[0]['headersmall'];
                    var generalparagraph = results[0]['generalparagraph'];
                    var drawtwo = results[0]['drawtwo'];
                    var reverse = results[0]['reverse'];
                    var skip = results[0]['skip'];
                    var wildcard = results[0]['wildcard'];
                    var wildcardplusfour = results[0]['wildcardplusfour'];
                    
                    callback("success", headerbig, headersmall, generalparagraph, drawtwo, reverse, skip, wildcard, wildcardplusfour);
                    
                    db.close();
                }
            });
        }
    });
}

