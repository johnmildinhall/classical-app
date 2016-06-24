var async = require('async');
var roman = require('./romanNumerals.js');
var helper = require('./helper.js');

//Individual composer page
exports.page = function(req, res){


  //console.log("START");
  var composer = req.param("composer");
  //check if legit composer
  var composerID = helper.composerCheck(composer, res); //get composer ID, if a real composer, else return 'not found'
  console.log(composerID);
  var composerShortName = helper.composerShortName(composerID);
  //console.log("Short Name: "+ composerShortName );

  if(typeof composerID!= 'undefined'){ //catch rogue calls with no composer (not sure why this happens)
    //need to make multiple calls to gather composer data
    async.parallel({

      details: function(callback){
        setTimeout(function(){
          
          Composer.findOne({'ID':composerID}, {'imageSmall':1,'imageMedium':1, 'imageLarge':1, 'ID':1, 'name':1, 'bio':1, 'images':1, 'life':1, 'popularity':1, 'followers':1, 'external_urls':1, 'type':1, 'href':1, 'quotes':1, 'relatedArtists':1, 'mostRecorded':1, 'tTracks':1, 'albums':1 }, function(err,data){
            if(typeof data === 'undefined'|data === null){
              res.render('not-found.jade', { title: "Not found", searchTerm: composer });
            }else{
              if(data.length < 1){
                res.render('not-found.jade', { title: "Not found", searchTerm: composer });
              }else{

                //LIFE
                if(typeof data.life != 'undefined'){
                  data.life = data.life[0].birthYear + " - " + data.life[0].deathYear;
                }

                //BACKGROUND IMAGE
                data.images = helper.asBackground(helper.getImageSize(data.images[0],null, null, true, data.imageLarge, data.imageMedium));
                
                //MOST RECORDED
                data.mostRecorded =  data.mostRecorded.slice(0,10);
                for ( var i in data.mostRecorded ){
                  data.mostRecorded[i] = data.mostRecorded[i][0];
                  data.mostRecorded[i].imageSmall = helper.asBackground(data.mostRecorded[i].imageSmall);
                  data.mostRecorded[i].url = helper.asArtistLink(data.mostRecorded[i].artist);
                }

                //RELATED ARTISTS              
                for ( i = 0 ; i < data.relatedArtists.length ; i++ ){
                  if(data.relatedArtists[i].length > 0){
                    data.relatedArtists = data.relatedArtists[i];
                  }
                }
                if(data.relatedArtists){
                  data.relatedArtists = data.relatedArtists.slice(0,10);
                  for ( i in data.relatedArtists){
                    data.relatedArtists[i].imageSmall = helper.asBackground(data.relatedArtists[i].imageSmall);
                    data.relatedArtists[i].url = helper.asComposerLink(data.relatedArtists[i].name);
                  }
                }

                //TOP TRACKS
                if(data.tTracks){
                  data.topTracks = data.tTracks.tracks;
                  for (i in data.tTracks.tracks){
                    data.tTracks.tracks[i].artists = helper.getArtistList(data.tTracks.tracks[i].artists);
                    //CATALOGUE LINKS IN TOP TRACK NAMES
                    data.tTracks.tracks[i].name = helper.addCatLink(data.tTracks.tracks[i].name, data.name);
                  }

                  data.topTracks.artists = data.tTracks;                
                }

                //ALBUMS
                if(data.albums.length > 0){
                  data.albums = data.albums[1];
                  data.albums = data.albums.slice(0,8);
                  for ( i in data.albums ){
                    data.albums[i].image = helper.asBackground(data.albums[i].image);
                  }                
                }

                //BIO
                //How much biography to show
                var bioLength = 400;
                console.log(data.bio);
                if(typeof data.bio!= 'undefined'){
                  if( data.bio.length > bioLength ){
                    data.bio2 = data.bio.substring( bioLength , data.bio.length);
                    data.bio = data.bio.substring(0, bioLength);
                  }
                  if( data.bio.length === 1 ){
                    if( data.bio[0].length > bioLength ){
                      data.bio2 = data.bio[0].substring( bioLength , data.bio[0].length);
                      data.bio = data.bio[0].substring(0, bioLength);
                    }                
                  }   
                }             

                //Quote
                if(typeof data.quotes != 'undefined'){
                  data.quote = helper.randomQuoteForComposer(data.quotes);
                }

                //short name
                data.shortName = composerShortName;
            
                //now find bigger images for related composers
                var relatedIDs = [];
                //console.log(data.relatedArtists);
                for ( i in data.relatedArtists ){
                  relatedIDs.push(data.relatedArtists[i].ID);
                }
                //console.log(relatedIDs);
                Composer.find({'ID':{$in:relatedIDs}}, {'imageMedium':1, 'imageLarge':1, 'ID':1, 'name':1, 'images':1}, function(err,relatedImages){
                  //console.log('!!!!!!!!');
                  //console.log(relatedImages);
                  data.relatedArtists = [];
                  for ( var i in relatedImages){
                    //console.log(helper.getImageSize(relatedImages[i].images[0]));
                    console.log("***");
                    thisImage = helper.asBackground(helper.getImageSize(relatedImages[i].images[0],100, 300, false, undefined, relatedImages[i].imageMedium));
                    console.log(thisImage);
                    thisUrl = helper.asComposerLink(relatedImages[i].name);
                    data.relatedArtists.push({
                        imageSmall : thisImage
                      , url : thisUrl
                      , name : relatedImages[i].name
                    });
                  }
                  callback(null, data);
                }).lean();

              }

            }

          }).lean();
        },100);
      },
      concerts: function(callback){
        setTimeout(function(){
            //console.log("CONCERTS");
            var rightNow = Math.floor(Date.now() / 1000);
            var oneYear = rightNow+(12*2629743);
            Concert.find(
              {
                  'composers.ID':composerID
                , 'date.utc':{
                    $gt:rightNow
                  , $lt:oneYear
                  }
              },{
                  '_id':1
                , 'title':1
                , 'subtitle':1
                , 'date':1,'price':1
                , 'composers':1
                , 'artists':1
                , 'url':1
                ,'venue':1
                , 'image':1
              },{
                    skip:0
                  , sort:{
                    'date.utc': 1 
                  }
              },function(err,data){
                //console.log(data);


                for ( var i in data ){

                  data[i].page = "/concerts/"+data[i]._id;
                  data[i].image = helper.asBackground(data[i].image);
                  data[i].composerList = helper.getComposerList(data[i].composers);
                  data[i].artistList = helper.getArtistList(data[i].artists); 

                 
                }
                callback(null, data);
              }
            );
          
        },100);
      },
      catalogue: function(callback){ //look up any catalogue index items for this composer
        setTimeout(function(){
          //console.log("CATALOGUES");
          var re = new RegExp(composerID, 'i');
          Catindex.find({'itemID':re}, function(err, data){
            var catalogueExists = false;
            if(data.length>0){
              catalogueExists = true;
            }
            callback(null, catalogueExists);
          }).lean();
        },100);
      }
    },

    function (err, results) {


      //console.log(typeof results.concerts[0]);
      //console.log(results.concerts.slice(1,3).length);
      
      //Organise concerts into featured and upcoming
      var upcoming = results.concerts.slice(1,3);
      var featured = [];
      var showFeatured = 'false';
      if(typeof results.concerts[0] !== 'undefined'){
        featured[0] = results.concerts[0];
        showFeatured = 'true';
      }

      var showUpcoming = 'false';
      if(typeof upcoming === 'undefined'){
        upcoming = [];
      }else{
        if(upcoming.length > 0){
          showUpcoming = 'true';
        }
        
      }


      //console.log(featured);
      // console.log("Upcoming length "+upcoming.length);
      // console.log("Featured length "+featured.length);
      // console.log("show Featured "+showFeatured);
      // console.log("show Upcoming "+showUpcoming); 

      //get head data
      var head = helper.headData('composer' , results.details.name , null);
      

      //console.log(results.details.topTracks);
      res.render('composer.jade', { 
          head : head
        , details : results.details
        , concerts : featured
        , upcoming : upcoming 
        , showFeatured : showFeatured
        , showUpcoming : showUpcoming
        , catalogueExists : results.catalogue
      });
    });

  }
  



};


//get albums in 8s
exports.albums = function(req,res){
  
  var id = req.param("id");
  var offset = parseInt(req.param("offset"));
  var end = offset+8;

  Composer.findOne({ID:id}, {"albums":1}, function(err,data){
    //console.log(data.albums);
    //data = JSON.parse(data);
    var albums = data.albums[1].slice(offset,end);

    //console.log(albums);
    res.send(albums);
  }).lean();
};

//get related composers in 10s
exports.related = function(req,res){
  var id = req.param("id");
  var offset = parseInt(req.param("offset"));
  var end = offset+11;

  Composer.findOne({ID:id}, {"relatedArtists":1}, function(err,data){
    //console.log(data.relatedArtists);
    //data = JSON.parse(data);
    var albums = data.relatedArtists[3].slice(offset,end);
    res.send(albums);
  }).lean();
};

//get artists who have recorded this composer in 10s
exports.mostRecorded = function(req,res){
  var id = req.param("id");
  var offset = parseInt(req.param("offset"));
  var end = offset+11;

  Composer.findOne({ID:id}, {"mostRecorded":1}, function(err,data){
    //console.log(data.mostRecorded);

    //fix data format

      var mostRecorded = [];
      console.log(data.mostRecorded.length);
      for ( i = offset ; i < end ; i++ ){
        if(data.mostRecorded[i]){
          mostRecorded.push(data.mostRecorded[i][0]);          
        }

      }      

    //console.log(mostRecorded);
    //var albums = data.mostRecorded[1].slice(offset,end);
    res.send(mostRecorded);
  }).lean();
};


//List all Composers page
exports.list = function(req,res){
  

  var offset = parseInt(req.param("offset"));
  offset = 0;
  //console.log(db);
  Composer.find({},{'name':1,'ID':1,'popularity':1,'popularity2':1,'followers':1,'images':1, 'life':1, 'imageSmall':1, 'imageMedium':1} , {sort: '-popularity2'}, function(err, data) {
    if (err) return console.error(err);

    //console.log(data[0].images[0]);

    //format images
    for ( var i = 0 ; i < data.length ; i++ ){
      //console.log(data[i].images[0]);
      data[i].images = helper.asBackground(helper.getImageSize(data[i].images[0], 0, 1000, undefined, data[i].imageMedium));      
    }

    //link to composers
    for ( i = 0 ; i < data.length ; i++ ){
      data[i].href = helper.asComposerLink(data[i].name);
    }
    console.log(data);

    var head = helper.headData('composerList', null, null );


    res.render('composerList.jade', { 
        head : head
      , title : 'Composers' 
      , data :data
    });

  }).limit(30).lean();

};

//if user clicks the more button, we get more composers
exports.listMore = function(req,res){
  console.log('composerList');
  var offset = parseInt(req.param("offset"));
  Composer.find({},{'name':1,'ID':1,'popularity':1,'popularity2':1,'followers':1,'images':1, 'life':1, 'imageMedium':1} , {sort: '-popularity2'}, function(err,data){

    
    for ( var i = 0 ; i < data.length ; i++ ){
      console.log(data[i].images[0]);
      data[i].images = helper.asBackground(helper.getImageSize(data[i].images[0], 0, 1000, undefined, data[i].imageMedium));      
      console.log(data[i].images);
    }

    for ( i = 0 ; i < data.length ; i++ ){
      data[i].href = helper.asComposerLink(data[i].name);
    }
    res.send(data);

  }).skip(offset).limit(30).lean();
};



exports.composerEdit = function(req,res){
  var composer = req.param("composer");
  composerID = null;
  var composerID = helper.composerCheck(composer); //get composer ID, if a real composer, else return 'not found'
  console.log(composerID);
  Composer.findOne({ID:composerID}, function(err,data){
    data.images = helper.asBackground(helper.getImageSize(data.images[0], 0, 1000));
    console.log(data.life);
    if(typeof data.life != 'undefined'){
      data.birth = data.life[0].birthDay+'/'+data.life[0].birthMonth+'/'+data.life[0].birthYear;
      data.death = data.life[0].deathDay+'/'+data.life[0].deathMonth+'/'+data.life[0].deathYear;      
    }

    res.render('composerEdit.jade', { data : data }); 
  }).lean();
    
};

exports.albumPage = function(req,res){
  var composer = req.param("composer");
  res.render('albums.jade', { title: composer });
};


////////EDIT DATA
exports.updateData = function(req,res){
  var ID = req.param('id');
  console.log(ID);
  console.log(req.body);
  res.send('received');
  // res.send(req.body.imageLarge);
  Composer.findOne({ID:ID}, {'imageSmall':1,'imageMedium':1,'imageLarge':1, 'ID':1, 'name':1, 'bio':1, 'images':1, 'life':1, 'popularity':1, 'followers':1, 'external_urls':1, 'type':1, 'href':1}, function(err,data){
    console.log(data.name);
    data.imageLarge = req.body.imageLarge;
    data.imageMedium = req.body.imageMedium;
    data.imageSmall = req.body.imageSmall;
    data.bio = decodeURI(req.body.bio);
    data.save(function(response){
      console.log(response);
    });
  //   //updates to date of birth
  //   //console.log(data.life);
  //   data.life.push(req.body.life[0]);

  //   console.log(data);

  });
};