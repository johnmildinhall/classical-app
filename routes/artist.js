var async = require('async');
var helper = require('./helper.js');

//individual artist page
exports.page = function(req, res){
	var artist = req.param("artist");
	var thisArtist = artist;
  //console.log(mrArtist);

  //we look up in mapreduce artist index to find the ID of the artist.
  mrArtist.findById(artist, function(err, data){
    console.log(data);
    var ID = null;
    for( var i in data ){
      if(i === 'value'){
        ID = data[i];
      }
      console.log( i + " "+data[i]);
    }
    
    console.log("!!!"+ID);
    //res.send(data.value);
    getPage(ID, thisArtist, res);
  }).lean();
};

function getPage(ID, artist, res){
    async.parallel({
    details: function(callback){
      setTimeout(function(){

        Artist.findById( ID , function(err, data) {
          if (err) return console.error(err);
          
          
          if(data === null){//typeof data === 'undefined'|data.length === 0){
            res.render('not-found.jade', { title: "Not found", searchTerm: artist });
          }else{
            //console.log(data);

            //images
            data.images = helper.asBackground(helper.getImageSize(data.images[0], 250, 1000, true));
            //console.log(data.images);


            //composer counts
            data.mostRecorded ='hello';
            //console.log(data.mostRecorded);
            //if these data exist, get most recorded
            var i = null;
            if(data.composerData[0]){
              data.mostRecorded = data.composerData[0][0].composerCounts;
              for ( i in data.mostRecorded){
                data.mostRecorded[i].url = helper.asComposerLink(data.mostRecorded[i].composer);
                data.mostRecorded[i].imageSmall = helper.asBackground(data.mostRecorded[i].imageSmall);
              }
              data.mostRecorded =  data.mostRecorded.slice(0,10);              
            }


            //related artists, if they exist
            if(data.relatedArtists[0]){
              data.relatedArtists = data.relatedArtists[0];
              data.relatedArtists = data.relatedArtists.slice(0,10);
              for ( i in data.relatedArtists){
                data.relatedArtists[i].imageSmall = helper.asBackground(data.relatedArtists[i].imageSmall);
                data.relatedArtists[i].url = helper.asArtistLink(data.relatedArtists[i].name);
              }              
            }


            //Top Tracks
            //console.log(data.topTracks[0]);
            if(typeof data.tTracks != 'undefined'){
              data.topTracks = data.tTracks.tracks;
              for ( i in data.tTracks.tracks){
                data.tTracks.tracks[i].artists = helper.getArtistList(data.tTracks.tracks[i].artists);
              }
              //console.log(data.tTracks.tracks[i].artists);
              data.topTracks.artists = data.tTracks;              
            }

            //Albums
            //console.log(data.albums);
            if(data.albums[0]){
              data.albums = data.albums[0];
              data.albums = data.albums.slice(0,8);
              for ( i in data.albums ){
                data.albums[i].image = helper.asBackground(data.albums[i].image);
              }              
            }

            //console.log(data);
            callback(null, data);
          }   
        }).lean();

        
      }, 100);

    },
    concerts: function(callback){
      setTimeout(function(){
          var rightNow = Math.floor(Date.now() / 1000);
          var oneYear = rightNow+(12*2629743);
          Concert.find(
            {
                'artists.name':artist
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
              console.log(data);
              callback(null, data);
            }
          );
        
      },100);
    },
    catalogue: function(callback){
      setTimeout(function(){
        callback(null, null);
      },100);
    }

  },

  function (err, results) {
    console.log(results);
    console.log("*******");
    var upcoming = results.concerts.slice(1,3);
    
    var featured = [];
    var showFeatured = 'false';
    var showUpcoming = 'false';
    if(typeof results.concerts[0] !== 'undefined'){
      featured[0] = results.concerts[0];
      showFeatured = 'true';
    }

    if(typeof upcoming === 'undefined'){
      upcoming = [];
    }else{
      if(upcoming.length > 0){
        showUpcoming = 'true';
      }
      
    }

    //get head data
    var head = helper.headData('artist' , results.details.name, null);

    console.log(results.concerts);
      res.render('artist.jade', {
        head : head 
      , details: results.details
      , concerts : featured
      , upcoming : upcoming 
      , showFeatured : showFeatured
      , showUpcoming : showUpcoming
    });
  } ); 
}

//List of artist's albums in 8s
exports.albums = function(req,res){
  var id = req.param("id");
  var offset = parseInt(req.param("offset"));
  var end = offset+8;
  Artist.findOne({ID:id}, {"albums":1}, function(err,data){
    //console.log(data[0]);
    var albums = data.albums[0].slice(offset,end);
    res.send(albums);
  }).lean();


};
//List of related artists in 10s
exports.related = function(req,res){
  var id = req.param("id");
  var offset = parseInt(req.param("offset"));
  var end = offset+11;
  //console.log("RELATED ARTISTS");
  Artist.findOne({ID:id}, {"relatedArtists":1}, function(err,data){
    //console.log(data.relatedArtists[0]);
    //data = JSON.parse(data);
    var albums = data.relatedArtists[0].slice(offset,end);
    res.send(albums);
  }).lean();
};

//List of most recorded composers by artists in 8s
exports.mostRecorded = function(req,res){
  var id = req.param("id");
  var offset = parseInt(req.param("offset"));
  var end = offset+11;

  Artist.findOne({ID:id}, {"composerData":1}, function(err,data){
    console.log(data);
    data.mostRecorded = data.composerData[0][0].composerCounts;
    console.log(data.mostRecorded);
    for ( var i in data.mostRecorded){
      data.mostRecorded[i].url = helper.asComposerLink(data.mostRecorded[i].composer);
      data.mostRecorded[i].imageSmall = helper.asBackground(data.mostRecorded[i].imageSmall);
    }
    data.mostRecorded =  data.mostRecorded.slice(offset,end);
    res.send(data.mostRecorded);
  }).lean();
};

//Render artists page
exports.list = function(req,res){
  ArtistIndex.find({}, function(err,data){
    if (err) return console.error(err);

    var i = null;
    //format images
    for ( i = 0 ; i < data.length ; i++ ){
      console.log(data[i].images);
      data[i].images = helper.asBackground(helper.getImageSize(data[i].images, 100, 1000));      
    }

    //link to composers
    for ( i = 0 ; i < data.length ; i++ ){
      data[i].href = helper.asArtistLink(data[i].name);
    }

    var head = helper.headData('artistList', null, null);

    res.render('artistList.jade', { 
        head : head
      , title : 'Composers' 
      , data : data
    });
  }).sort({'relevance':-1}).limit(30).lean();

};





exports.listMore = function(req,res){
  console.log('artistList');
  var offset = parseInt(req.param("offset"));
  ArtistIndex.find({}, function(err,data){

    var i = null;
    for ( i = 0 ; i < data.length ; i++ ){
      console.log(data[i].images);
      data[i].images = helper.asBackground(helper.getImageSize(data[i].images,100,1000));
      console.log(data[i].images);
    }
    for ( i = 0 ; i < data.length ; i++ ){
      data[i].href = helper.asArtistLink(data[i].name);
      console.log(data[i].href);
    }
    res.send(data);

  }).sort({'relevance':-1}).skip(offset).limit(30).lean();
};

exports.topTracks = function(req,res){
	var ID = req.param("id");

	Artist.findOne({'ID':ID}, {'topTracks':1}, function(err,data){
		console.log("topTracks:"+ data.topTracks );
		res.send(data.topTracks[0]);
	});
};

exports.details = function(req,res){
	var ID = req.param("id");
	Artist.findOne({'ID':ID}, { 'name' : 1, 'ID' : 1, 'images' : 1 },  function(err,data){
		console.log(data);
		res.send(data);
	});
};

exports.composerData = function(req,res){
	var ID = req.param("id");
	Artist.findOne({'ID':ID}, { 'composerData' : 1 },  function(err,data){
		//console.log(data.composerData);
		res.send(data.composerData[0]);
	});
};