var moment = require('moment');
var helper = require('./helper.js');

exports.page = function(req, res){
	var albumID = req.param("albumID");
	var composer = req.param("composer");
  var artist = req.param("artist");

	Album.findOne({"_id":albumID}, {'_id':1, 'name':1, 'images':1, 'popularity':1, 'release_date':1, 'tracks':1}, function(err, data) {
    if (err) return console.error(err);
    //res.send(data);

    //create list of artists and composers
    data.artistList = [];
    data.composerList =[];
    data.tracks.forEach(function(track){
      //add non duplicate artists to list
      track.artists.forEach(function(artist){
        var notFound = 0;
        for ( var i in data.artistList){
          if(artist.name === data.artistList[i].name){notFound++;}
        }
        if(notFound === 0){
          data.artistList.push({
            'name':artist.name
          });
        }
      });

      //add non-duplicate composers to list
      var notFound = 0;
      for( var i in data.composerList){
        if(track.composer === data.composerList[i].shortName){notFound++;}
      }
      if(notFound === 0){
        if(track.composer.length > 0){
          data.composerList.push({
            'shortName':track.composer
          });
        }
      }

    });

    data.composerList = helper.getComposerList(data.composerList);
    data.artistList = helper.getArtistList(data.artistList);
    //console.log(data.composerList);
    //console.log(data.artistList);

    //location of album
    data.albumComposer = composer;
    data.albumArtist = artist;
    data.albumComposerShort = helper.ellipsis(composer, 20);
    data.albumArtistShort = helper.ellipsis(artist, 20);
    console.log("composer: "+composer);
    console.log("artist: "+artist);

    //shorten album name if too long
    data.shortName = helper.ellipsis(data.name, 20);


    //parse date
    var thisDate = new Date(data.release_date);
    data.release_date = moment(thisDate).format("Do MMMM YYYY");

    //make image right size
    data.images = helper.asBackground(helper.getImageSize(data.images, 0, 1000)); 

    var head = helper.headData('album', data.name , data._id );

    res.render('album.jade', { 
        head : head
      , data : data
    });        


  }).lean();
};
