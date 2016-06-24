
var async = require('async');
var helper = require('./helper.js');

//render the home page 
exports.page = function(req, res){

  //multiple calls, waiting for them asynchronously
  async.parallel({

    ///////////////////////
    //Pick a random quote//
    ///////////////////////
    quote: function(callback){
        setTimeout(function(){
          Composer.find({ 'quotes' :{ $ne : null } } , { 'imageMedium':1, 'imageLarge':1 , 'quotes' : 1 , 'ID' : 1 , 'name' :1 , 'images':1, 'shortName':1}, function(err, quotes){
            //quotes.toObject();
            console.log(quotes);
            var theseQuotes = [];
            for ( i = 0 ; i < quotes.length ; i++ ){
              //console.log( quotes[i].quotes.length);
              if(typeof quotes[i].quotes !== 'undefined'){
                if( quotes[i].quotes.length !== 0){
                  theseQuotes.push(quotes[i]);
                }
              }
            }
            //console.log(theseQuotes);
            var quoteData = helper.randomQuote(theseQuotes);

            
            quoteData.images = quoteData.images[0].splice(0,quoteData.images[0].length);
            quoteData.images = helper.asBackground(helper.getImageSize(quoteData.images, null, null, true, quoteData.imageLarge, quoteData.imageMedium));
            quoteData.url = helper.asComposerLink(quoteData.name);

            //console.log(quoteData);
            quoteData.quotes = quoteData.quotes[0];
            console.log("Quote Length: "+quoteData.quotes.length);

            callback(null, quoteData);
          }).lean();
        }, 100);
    },



    //////////////////////////
    //Get composer Birthdays//
    //////////////////////////
    birthdays: function(callback){
        setTimeout(function(){

          var dd = [];
          var mm = [];

          for ( i = 0 ; i < 14 ; i++){
            var d = new Date(+new Date() + (i*86400000));
            dd[i] = d.getDate();
            mm[i] = d.getMonth()+1;

            //console.log(dd[i]+'/'+mm[i]);
          }

          //console.log(dd+'/'+mm);
          Composer.find({
            $or:[
              {$and: [ {'life.birthDay':dd[0]}, {'life.birthMonth':mm[0]}] },
              {$and: [ {'life.birthDay':dd[1]}, {'life.birthMonth':mm[1]}] },
              {$and: [ {'life.birthDay':dd[2]}, {'life.birthMonth':mm[2]}] },
              {$and: [ {'life.birthDay':dd[3]}, {'life.birthMonth':mm[3]}] },
              {$and: [ {'life.birthDay':dd[4]}, {'life.birthMonth':mm[4]}] },
              {$and: [ {'life.birthDay':dd[5]}, {'life.birthMonth':mm[5]}] },
              {$and: [ {'life.birthDay':dd[6]}, {'life.birthMonth':mm[6]}] },
              {$and: [ {'life.birthDay':dd[7]}, {'life.birthMonth':mm[7]}] },
              {$and: [ {'life.birthDay':dd[8]}, {'life.birthMonth':mm[8]}] },
              {$and: [ {'life.birthDay':dd[9]}, {'life.birthMonth':mm[9]}] },
              {$and: [ {'life.birthDay':dd[10]}, {'life.birthMonth':mm[10]}] },
              {$and: [ {'life.birthDay':dd[11]}, {'life.birthMonth':mm[11]}] },
              {$and: [ {'life.birthDay':dd[12]}, {'life.birthMonth':mm[12]}] },
              {$and: [ {'life.birthDay':dd[13]}, {'life.birthMonth':mm[13]}] }
            ]
            
          },{
              'popularity':1
            , 'name':1
            , 'ID':1  
            , 'life':1
            , 'images':1
            , 'imageLarge':1
            , 'imageMedium':1
          },function(err,data){

            //data = JSON.parse(data);
            //console.log(data);

            var sendData = [];

            for( i = 0 ; i < data.length ; i++ ){
              var theseData = data[i].toObject();
              //console.log(theseData.popularity);

              var timing = getDay(theseData.life[0].birthDay , theseData.life[0].birthMonth);
              theseData.images = helper.asBackground(helper.getImageSize(theseData.images[0], 0, 500, theseData.imageLarge, theseData.imageMedium));
              //console.log(theseData.images);
              theseData.url = helper.asComposerLink(theseData.name);
              theseData.life = theseData.life[0].birthYear + " - " + theseData.life[0].deathYear;
              theseData.when = timing.when;
              theseData.order = timing.order;
              //console.log(theseData);
              sendData.push(theseData);
            }
            //console.log(data);
            sendData.sort(compare);

            //console.log("&&&&&&&&&");
            //console.log(sendData);
            callback(null, sendData);
          });

          function compare(a,b) {
            if (a.order < b.order)
              return -1;
            if (a.order > b.order)
              return 1;
            return 0;
          }

          function getDay(birthDay, birthMonth){
            var today = new Date();
            var comparisonDate = birthMonth+'/'+birthDay+'/'+today.getFullYear();
            //console.log(comparisonDate);
            var comparison = new Date(comparisonDate);
            var msToMidnight = helper.msUntilMidnight();
            
            //console.log(comparison);
            var timeDiff = Math.abs(comparison.getTime() - today.getTime());

            //console.log(today.getDay());

            var output = {};

            if( today.getDate() === birthDay ){
              output = {
                  when: "Today"
                , order: 0
              };
              return output;

            }else{

              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
              //console.log(diffDays);
              var days = {
                  0:'Sunday'
                , 1:'Monday'
                , 2:'Tuesday'
                , 3:'Wednesday'
                , 4:'Thursday'
                , 5:'Friday'
                , 6:'Saturday'
              };
              var returnedDay = "";
              // console.log(birthDay+"/"+birthMonth);
              // console.log("timeDiff: "+ timeDiff);
              // console.log("diffDays: "+ diffDays);
              if(diffDays === 0){
                returnedDay = "Today";
              }
              if(diffDays === 1){
                returnedDay = "Tomorrow";
              }
              if(diffDays > 1 & diffDays < 7){

                returnedDay = days[comparison.getDay()];
              }
              if(diffDays > 6 ){
                returnedDay = "Next "+days[comparison.getDay()];
              }

              //console.log(returnedDay);

              output = {
                  when: returnedDay
                , order: diffDays
              };

              return output;
            }
          }
            
        }, 100);
    },

    concerts: function(callback){
        setTimeout(function(){
        var rightNow = Math.floor(Date.now() / 1000);
        var oneMonth = rightNow+2629743;
        Concert.find(
          {'date.utc':{
              $gt:rightNow
            , $lt:oneMonth}},{
              '_id':1
            , 'title':1
            , 'subtitle':1
            , 'date':1,'price':1
            , 'composers':1
            , 'artists':1
            , 'url':1
            , 'venue':1
            , 'image':1
          },{
                skip:0
              , sort:{
                'date.utc': 1 
              }
          },
          function(err,data){
            for ( var i in data ){
              data[i].image = 'background-image:url('+data[i].image+');';
            }
            
            callback(null, data);
          }
        ).limit(4).lean();  
        }, 100);
    },

    featuredAlbum: function(callback){
      setTimeout(function(){
        featuredIndex.findOne({'_id':'aaa111'}, function(err, data){
          //console.log(data);
          
          var featuredID = helper.randomFeaturedAlbum(data.featured);
          //console.log(featuredID);
          Album.findOne({'_id':featuredID}, function(err, data){
            
            //get best image
            data.images = helper.asBackground(helper.getImageSize(data.images, 0, 500, true));
            //artists as HTML list
            data.artists = helper.getArtistList(data.artists);
            //console.log(data.composers);

            //composers as HTML list
            if(typeof data.composers != 'undefined'){
              if(data.composers!== null&data.composers.length>0){
                data.composers = helper.getComposerList(data.composers);
              }
            }

            data.name = '<a href = "/albums/'+ data._id +'">'+data.name+'</a>';

            //play random track from album
            data.preview_url = helper.getRandomPreviewURL(data.tracks);
            //console.log(data.preview_url);
            
            //console.log(data.images);
            callback(null, data);
          }).lean();
        });
      }, 100);
    }
  },

  function(err, results) {

    //console.log(results);
    for (var i = 0 ; i < results.concerts.length ; i++ ){
      results.concerts[i].composerList = helper.getComposerList(results.concerts[i].composers);
      results.concerts[i].artistList = helper.getArtistList(results.concerts[i].artists);
      results.concerts[i].page = "/concerts/"+results.concerts[i]._id;
      //console.log(results.concerts[i].artists);
    }

    //console.log(results.concerts);
    var upcoming = results.concerts[0];
    var concerts = results.concerts.splice(1,results.concerts.length);
    //console.log(results.concerts);

    //get head data
    var head = helper.headData('home' , "", null);

    res.render('index.jade', { 
        head : head
      , quote : results.quote
      , birthdays : results.birthdays
      , upcoming : upcoming
      , concerts : concerts
      , featured : results.featuredAlbum
    });
  });


};











