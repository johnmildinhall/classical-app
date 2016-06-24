var mongoose = require('mongoose');

exports.connect = function () {
  var options = { 
        server : { socketOptions: { keepAlive: 1 } }
      , auth: {authdb:"admin"}
     };
  var localOptions = { 
        server : { socketOptions: { keepAlive: 1 } }
     };      
  //docker/aws
  // var c = mongoose.connect('mongodb://superuser:12345678@ec2-54-171-90-69.eu-west-1.compute.amazonaws.com:27017/classical', options, function(error){
  //   console.log(error);
  // });
  // console.log(c);

  //local
  var c = mongoose.connect("mongodb://localhost:27017/classical", localOptions);


  mongoose.connection.on('error', function (err) {
    console.log(err);
  });
  mongoose.connection.on('open', function() {
    console.log('open')
  })
  mongoose.connection.on('connected', function (err) {
    //console.log("Connected to DB using chain: " + connectionString);
  });
  //local
  //
  return c;
};

exports.mrArtistSchema = mongoose.Schema({
    _id : String
  , value : String
})

exports.mrAlbumSchema = mongoose.Schema({
    _id : String
  , value : String
})

exports.trackSchema = mongoose.Schema({
    _id : String
  , name : String
  , ID : String
  , artists : [{
      name : String
    , ID : String
  }]
  , composer : String
  , composerID : String
  , disc_number : String
  , duration_ms : Number
  , href : String
  , preview_url : String
  , symbol : String
  , workStr : String
  , work : Number
  , suffixStr : String
  , suffix : Number
  , postfixStr : String
  , postfix : Number 
  , albumID : String
  , albumName : String
  , images: [{
      height: Number
    , width: Number
    , url: String
  }]
});

exports.catalogueSchema = mongoose.Schema({
    _id : String
  , composerID : String
  , symbol : String
  , work : Number
  , workStr : String
  , suffix : Number
  , suffixStr : String
  , postfix : Number
  , postfixStr : String
  , canonicalName : String
  , tracks : [exports.trackSchema]
})

exports.catindex = mongoose.Schema({
      itemID : String
    , symbol : String
    , work : Number
    , workStr : String
    , suffix : String
    , suffixstr : String
    , postfix : Number
    , postfixStr : String
    , canonicalName : String
    , count : Number    
})

exports.featuredIndex = mongoose.Schema({
  _id : String
  , featured : [{
    _id : String
  }]
})

exports.tTrackSchema = mongoose.Schema({
    album: {
        album_type: String
      , available_markets : []
      , external_urls : []
      , href : String
      , id : String
      , images : [{
          height: Number
        , width: Number
        , url: String
        }]
      , name : String
      , type : String
      , uri : String
      }
    , artists : [ {
          external_urls : []
        , href : String
        , id : String
        , name : String
        , typeOfArtist : String
        , uri : String
      } ]
    , available_markets : []
    , disc_number : Number
    , explicit : Boolean 
    , external_ids : {}
    , external_urls : {}
    , href : String
    , popularity : Number
    , preview_url : String
    , track_number : Number
    , typeOfTrack : String
    , uri : String
    , id : String
    , name : String

});

exports.composer = mongoose.Schema({
    name: String
  , ID: String
  , bio: String   
  , life: {
      birthDay: Number
    , birthMonth: Number
    , birthYear: Number
    , deathDay: Number
    , deathMonth: Number
    , deathYear: Number
  }
  , external_urls: String
  , followers: Number
  , imageSmall: String
  , imageMedium: String
  , imageLarge: String
  , images: [{
      height: Number
    , width: Number
    , url: String
  }]
  , href: String
  , quotes : []
  , type: String
  , uri: String
  , popularity: String
  , popularity2: Number
  , relatedArtists: [{
      ID: String
    , name: String 
    , imageSmall: String
    , popularity: Number
  }]
  , mostRecorded: [{
      artist: String
    , ID: String
    , count: Number
    , imageSmall: String
  }]
  , albums: [{ 
      name: String
    , ID: String
    , image: String
    , external_urls: String
    , tracks: [{
        name: String
      , ID: String
      , popularity: String
      , external_urls: String     
    }]
    , artists: [{
      ID: String
    }]
  }]
  , tTracks: { 
      tracks : [exports.tTrackSchema]
  }
  , topTracks: [{
      name: String
    , artists: [{
        ID : String
      , name : String
    }]
    , ID: String
    , popularity: String
    , external_urls: String
  }]     
});

exports.albumSchema = mongoose.Schema({
    _id: String
  , name: String
  , ID : String
  , popularity : String
  , popularity2: Number
  , featured : Boolean
  , release_date : String
  , external_urls : String
  , classicalness: Number
  , artists : [{
      name : String
    , ID : String
  }]
  , composers: [{
      ID : String
    , shortName : String
    , composer : String
  }]    
  , images: [{
      height: Number
    , width: Number
    , url: String
  }]
  , href : String
  , uri : String
  , tracks : [exports.trackSchema]
}); 

exports.artistIndexSchema = mongoose.Schema({
    _id: String
  , name: String 
  , images: [{
      height: Number
    , width: Number
    , url: String
  }]
  , relevance: Number 
});

//changed popularity to array from number
exports.artistSchema = mongoose.Schema({
    _id: String
  , name: String
  , ID: String
  , bio: String
  , classicalness: Number
  , relevance: Number
  , topArtist: Boolean
  , external_urls: String
  , followers: Number
  , imageSmall: String
  , imageMedium: String
  , imageLarge: String
  , images: [{
      height: Number
    , width: Number
    , url: String
  }]
  , genres: [{
      genre: String
  }]
  , composerData: [{
      composerN : Number
    , total: Number
    , classicalness: Number
  }]
  , inferredGenre: String
  , href: String
  , type: String
  , uri: String
  , popularity: []
  , popularity2: Number
  , relatedArtists: [{
      ID: String
    , name: String 
    , imageSmall: String
  }]
  , albums: [{ 
      name: String
    , ID: String
    , image: String
    , external_urls: String
    , tracks: [{
        name: String
      , ID: String
      , popularity: String
      , external_urls: String     
    }]
    , artists: [{
      ID: String
    }]
  }]
  , tTracks: { 
    tracks : [exports.tTrackSchema]
  }
  , topTracks: [{
      name: String
    , artists: [{
        ID : String
      , name : String
    }]
    , composers: [{
        ID : String
      , name : String
    }]
    , ID: String
    , popularity: String
    , external_urls: String
  }]  
            
  });

exports.concertSchema = mongoose.Schema({
    _id: String
  , url: String
  , title: String
  , subTitle: String
  , venue: String
  , subVenue: String
  , image: String
  , date: {
      utc: String
    , longHumanDate: String
    , shortHumanDate: String
    , asFound: String
    , day:String
    , month:String
    , year:Number
    , time:String
  }
  , composers: [{
      ID : String
    , shortName : String
    , composer : String
  }]
  , artists: [{
      ID : String
    , name : String
  }]
  , price: {
      max:Number
    , min:Number
    , singlePrice:Number
    , bookingFee:Number
    , currency:String
  }

})

