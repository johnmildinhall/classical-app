var roman = require('./romanNumerals.js');
var async = require('async');
var helper = require('./helper.js');
var cat = require('../cat-abbr.js');

//Generate catalogue pages

exports.catPage = function(req , res){
  var composer = req.param("composer");
  var symbol = req.param("symbol");
  var work = req.param("work");
  var suffix = req.param("suffix");
  var postfix = req.param("postfix");

  //find composer ID
  composerID = null;
  var composers = require('../composer-data.js');
  var composerID = helper.composerCheck(composer, res); //get composer ID, if a real composer, else return 'not found'
  console.log("composer ID: "+ composerID );

  // console.log(composer);
  // console.log(symbol);
  // console.log(work);
  console.log("SUFFIX : "+ suffix);
  async.parallel({

    details: function(callback){
      setTimeout(function(){
        callback(null, '');
      }, 1);
    }
  },
    function (err, results) {

      //work out which catalogue symbols to look for
      var catArray = [{
              'name': 'Opus'
            , 'abbreviationList': ['Op','Opus']
            , 'abbreviationDefault': ['Opus']
            , 'description': 'Standard Opus numbers'}
          ,{
              'name': 'WoO'
            , 'abbreviationList': ['WoO']
            , 'abbreviationDefault': ['WoO']
            , 'description': 'Werke ohne Opuszahl - works without an Opus number'}
          ]; 
      cat.data.forEach(function(thisOne){
        if(thisOne.id === composerID){
          if(thisOne.alternative === ""){
            catArray.push({
              'name': thisOne.name
            , 'abbreviationList': [thisOne.abbreviation]
            , 'abbreviationDefault': [thisOne.abbreviation]
            , 'description': thisOne.description
          }); //array of one abbreviation          
          }
          if( thisOne.alternative !== "" ){
            catArray.push({
              'name': thisOne.name
            , 'abbreviationList': [thisOne.abbreviation, thisOne.alternative]
            , 'abbreviationDefault': [thisOne.abbreviation]
            , 'description': thisOne.description
          }); //array of abbreviation plus alternative
          }
        }
      });


      var re = "";

      //root cat page
      if(typeof symbol==='undefined' & typeof work === 'undefined' & typeof suffix === 'undefined'){
        for ( var i =0 ; i < catArray.length ; i++ ){
          re += composerID+catArray[i].abbreviationDefault;
          if(i < (catArray.length-1)){
            re +="|";
          }
        }
        console.log(re);
        //find out which catalogue items have entries
        Catindex.find({"itemID": { "$regex": re, "$options": "i" }},function(err, data){
          console.log(data.length);
          var newCatArray = [];

          for ( var i in catArray){
            re = new RegExp(composerID+catArray[i].abbreviationDefault, 'i');
            var filtered = [];
            for ( var j in data ){
              if (re.test(data[j].itemID)) {
                filtered.push(data[j].itemID);
              }
            }
            console.log(catArray[i].abbreviationDefault+": "+filtered.length);
            //if there are entries, add to catArray
            if(filtered.length>0){
              catArray[i].count = filtered.length;
              newCatArray.push(catArray[i]);
            }
          }
          console.log(newCatArray);
          res.render('catalogue.jade', { composer: composer, data : newCatArray });
        }).lean();
        
      }  

      //need to check for a legit symbol here, as well as deal with alternatives
      catArray.forEach(function(thisCat){
        var foundSymbol = false;
        thisCat.abbreviationList.forEach(function(thisAbbreviation){
          if(symbol === thisAbbreviation ){
            foundSymbol = true;
          }
        });
        if (foundSymbol === true){
          symbol = thisCat.abbreviationDefault;
        }
      });



      //symbol only
      if(typeof symbol!='undefined' & typeof work === 'undefined' & typeof suffix === 'undefined'){
        re = new RegExp(composerID, 'i');
        Catindex.find({'itemID':re, 'symbol':symbol }, function(err, data){
          //console.log(data);
          var catArray = [];
          for ( var i in data ){


            //get first and last bits of the name, and make canonical name first bit.
            var nameSplit = data[i].canonicalName.split(/[:,]+/);
            data[i].canonicalName = nameSplit[0];
            
            data[i].suffixName = nameSplit[nameSplit.length-1];
            data[i].suffixName = data[i].suffixName.split(/[.]+/);
            data[i].suffixName = data[i].suffixName[data[i].suffixName.length-1];
            //console.log(data[i]);

            //de-duplicated list of works
            var found = false;
            for ( var j in catArray ){
              if(catArray[j].work === data[i].work ){
                found = true;
                //console.log(catArray[j]);
                catArray[j].suffix.push(data[i]);
              }
            }
            if ( found === false ){
              var thisItem = {
                  'symbol' : data[i].symbol
                , 'work' : data[i].work
                , 'canonicalName': data[i].canonicalName
                , 'count' : data[i].count
                , 'suffix' : [data[i]]
              };
              catArray.push(thisItem);
            }

            //Now sort the by work
            catArray.sort(function(a, b) {
              return a.work - b.work;
            });

            for ( i in catArray ){
              //console.log(catArray[i].suffix);
              catArray[i].suffix.sort(function(a, b) {
                return a.suffix - b.suffix;
              });              
            }
            //console.log(catArray[50]);
            
            //data[i].canonicalName = data[i].canonicalName.substr(0, data[i].canonicalName.indexOf(',')); 
          }
          res.render('catalogue-symbol.jade', { composer: composer, symbol : symbol, data : catArray });
        }).lean();
      }



      //symbol and work
      if(typeof symbol!='undefined' & typeof work != 'undefined' & typeof suffix === 'undefined'){
        console.log("Symbol and work");
        re = new RegExp(composerID, 'i');
        console.log("db.catalogues.find({'composerID':'"+ composerID +"', 'symbol':'"+ symbol +"', 'work':'"+work+"'})");
        Catindex.find({'itemID':re, 'symbol':symbol, 'work':work }, function(err, data){

          console.log(data);
          var catArray = [];
          for ( var i in data ){

            //just take the first part of the name
            //get first and last bits of the name
            var nameSplit = data[i].canonicalName.split(/[:,]+/);
            data[i].canonicalName = nameSplit[0];
            
            data[i].suffixName = nameSplit[nameSplit.length-1];
            data[i].suffixName = data[i].suffixName.split(/[.]+/);
            data[i].suffixName = data[i].suffixName[data[i].suffixName.length-1];


            //de-duplicated list of works
            var found = false;
            for ( var j in catArray ){
              if(catArray[j].work === data[i].work ){
                found = true;
                //console.log(catArray[j]);
                catArray[j].suffix.push(data[i]);
              }
            }
            if ( found === false ){
              var thisItem = {
                  'itemID' : data[i].itemID
                , 'symbol' : data[i].symbol
                , 'work' : data[i].work
                , 'canonicalName': data[i].canonicalName
                , 'count' : data[i].count
                , 'suffix' : [data[i]]
              };
              catArray.push(thisItem);
            }        
          }

          var catIDs = [];
          if(typeof catArray[0] != 'undefined'){
            for ( i in catArray[0].suffix){
               
              catIDs.push(catArray[0].suffix[i].itemID);
            }
            var re = catIDs.join("|");  
            re = re.replace(':undefined',''); //in some cases the ID includes :undefined as suffix

            console.log(re);
            Catalogue.find({'_id': { "$regex": re, "$options": "i" }, 'work':work}, function(err, data){
              //Make sure it is only this work number included
              console.log(data);
              // var theseData = [];
              // for ( var i in data){
              //   console.log(work +" "+ data[i].work);
              //   if( data[i].work === work ){
              //     theseData.push(data[i]);
              //   }
              // }
              // console.log(theseData);
              // data = theseData;
              for ( var i in data ){

                //just take the first part of the name
                //get first and last bits of the name
                var nameSplit = data[i].canonicalName.split(/[:,]+/);
                data[i].canonicalName = nameSplit[0];
                
                data[i].suffixName = nameSplit[nameSplit.length-1];
                data[i].suffixName = data[i].suffixName.split(/[.]+/);
                data[i].suffixName = data[i].suffixName[data[i].suffixName.length-1];

                //sort artist lists as urls, make album images background images
                for (var j in data[i].tracks){
                  data[i].tracks[j].artists = helper.getArtistList(data[i].tracks[j].artists);
                  data[i].tracks[j].images = helper.asBackground(helper.getImageSize(data[i].tracks[j].images, 0, 200, undefined, undefined));      
                }      
              }
              //console.log(data);
              res.render('catalogue-work.jade', { composer: composer, symbol : symbol, data : data, canonicalName : data[0].canonicalName, work : work });
             }).lean();
          }  
        }).lean();
      }
      



      //Symbol, work and suffix
      if(typeof symbol!='undefined' & typeof work != 'undefined' & typeof suffix != 'undefined' & typeof postfix === 'undefined'){
        console.log("Symbol, work and suffix");
        //determine if suffix is Int or Roman Numeral
        if (isNaN(parseInt(suffix))){
          suffix = helper.roman_to_int(suffix);
          //console.log('not a number');
          //console.log(suffix);
        }
        console.log("db.catalogues.findOne({'composerID':'"+composerID+"', 'symbol':'"+symbol+"', 'work':'"+work+"','suffix':'"+suffix+"'})");
        
        Catalogue.find({'composerID':composerID, 'symbol':symbol, 'work':work, 'suffix':suffix}, {'tracks': 1}, function(err, data){
          
          data = data[0];
          //console.log(data);
          
          //make artists urls
          if( data !== null ){
            for (var i in data.tracks){
              data.tracks[i].artists = helper.getArtistList(data.tracks[i].artists);
            }      
          }
          //get image
          for ( var j in data.tracks ){
            data.tracks[j].images = helper.asBackground(helper.getImageSize(data.tracks[j].images, 0, 200, undefined, undefined));      
          }

          //res.render('not-found.jade', { title: "Not found", searchTerm: composer ,composer: composer, ID : composerID, data:data});
          res.render('catalogue-suffix.jade', { composer: composer, ID : composerID, symbol:symbol, work:work, suffix:suffix, data:data});
          

        }).lean();    
      }


      //Symbol, work, suffix and postfix

      if(typeof symbol!='undefined' & typeof work != 'undefined' & typeof suffix != 'undefined' & typeof postfix != 'undefined'){
        console.log('postfix');
        if (isNaN(parseInt(suffix))){
          suffix = helper.roman_to_int(suffix);
        }
        if (isNaN(parseInt(postfix))){
          suffix = helper.roman_to_int(postfix);
        }
        Catalogue.find({'composerID':composerID, 'symbol':symbol, 'work':work, 'suffix':suffix, 'postfix':postfix}, {'tracks': 1}, function(err, data){
          data = data[0];
          //make artists urls
          if( data !== null){
            for ( var i in data.tracks ){
              //console.log(data.tracks[i].artists);
              data.tracks[i].artists = helper.getArtistList(data.tracks[i].artists);
            }      
          }
          //get image
          for ( var j in data.tracks ){
            data.tracks[j].images = helper.asBackground(helper.getImageSize(data.tracks[j].images, 0, 200, undefined, undefined));      
          }
          console.log(data);
          res.render('catalogue-postfix.jade', { composer: composer, ID : composerID, symbol:symbol, work:work, suffix:suffix, postfix:postfix, data:data});
        }).lean();

      }


    }
  );
};