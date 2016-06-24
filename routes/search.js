var helper = require('./helper.js');
var composers = require('../composer-data.js');


exports.searchArtist = function(req,res){
  var searchString = req.param("searchString");
  //searchString = new RegExp('.*'+searchString+'.*');
  //mrArtist.find({'_id':searchString}, function(err, data){
  mrArtist.find({'_id':{ "$regex": searchString, "$options": "i" }}, function(err, data){
    //console.log(data);
    var IDarray = [];
    for ( var i in data ){
      IDarray.push(data[i].value);
    }
    searchArtistWithIds(IDarray, res);
  }).lean();

};

function searchArtistWithIds(IDarray, res){

  Artist.find({
    '_id': { $in: IDarray } //    , 'classicalness': {$gt : 0}
  },  
    function(err, data){
      console.log(data);
      if( data.length > 0){
        for ( var i = 0 ; i < data.length ; i++){
          //only try to get images if the array has them
          if('images' in data[i]){
            //console.log(data[i].images[0]);
            var imageSmall = helper.getImageSize(data[i].images[0] , 0 , 300, false);
            //console.log(imageSmall);
            data[i].imageSmall = imageSmall;
            delete data[i].images;
          }
        }             
      }

      if (err){res.send(err);}else{res.send(data);}
  }).sort({'popularity2':-1}).limit(3).lean();

}

exports.searchComposer = function(req,res){
  var searchString = req.param("searchString");
  //console.log(searchString);

  Composer.find(
                { 'name' : { "$regex": searchString, "$options": "i" }
                }
              , { 'name':1, 'imageSmall':1, 'life':1}
              , { limit : 3}
              , function(err,data){
    if (err){res.send(err);}else{res.send(data);}
  });

};

exports.searchAlbum = function(req,res){
  var searchString = req.param("searchString");
  //console.log(searchString);
  mrAlbum.find({'_id':{ "$regex": searchString, "$options": "i" }}, function(err, data){
    //console.log(data.length);
    var IDarray = [];
    for (var i in data){
      IDarray.push(data[i].value);
    }
    searchAlbumById(IDarray, res);
  }).lean();


};

function searchAlbumById(IDarray, res){
  Album.find(
            {'_id': { $in: IDarray }}
          , { 
                'name':1
              , 'images':1
            }
          , function(err,data){

            //console.log(data);

            var albumData = [];

            //get the right size image


            function AlbumData ( _id, name, image){
              this._id = _id;
              this.name = name;
              this.image = image;
            }

            if( data.length > 0){
              for ( var i in data ){


                //console.log(data[i].images[0]);
                  //only try to get images if the array has them
                  if('images' in data[i]){
                    //console.log(true);
                    var imageSmall = helper.getImageSize(data[i].images , 200 , 400);
                    //console.log('Image Small: '+imageSmall);
                    albumData[i] = new AlbumData( data[i]._id, data[i].name, imageSmall);
                  }else{
                    albumData[i] = new AlbumData( data[i]._id,data[i].name, "");
                  }
              }             
            }

            //console.log(data);
              //console.log(data);
              if (err){res.send(err);}else{res.send(albumData);}
            }).sort({'popularity2':-1}).limit(3).lean();
}

exports.searchTrack = function(req,res){
  var searchString = req.param("searchString");
  //console.log(searchString);

  Track.find(
            { 'name' : { "$regex": searchString, "$options": "i" } }
          , {'name':1,'artists':1, 'preview_url':1, 'composer':1}
          , {limit:25}
          , function(err,data){
    //console.log(data);
    if (err){res.send(err);}else{res.send(data);}
  });

};

exports.searchCatalogue = function(req,res){

  var searchString = req.param("searchString");
  var composerID = findComposer(searchString);
  if(composerID!==null){
    Catindex.find({"_id":composerID}, function(err,data){
      //res.send(data);
      var cat = require('../cat-abbr.js');
      var catArray = ['Op','WoO']; //generic Op and Werk ohne Opuszahn
      cat.data.forEach(function(thisOne){
        if(thisOne.id === composerID){
          catArray.push(thisOne.abbreviation);
          if(thisOne.alternative!==""){
            catArray.push(thisOne.alternative);
          }
        }
      });
      res.send(catArray);
    });    
  }

  

};

//helper function to get composer out of a string
function findComposer(string){
  var tokens = string.split(/\s+/);
  //find if these match shortnames;
  var composerID = null;
  for ( var i in composers.data ){
    for ( var j in tokens ){
      if( composers.data[i].shortName === tokens[j]){
        composerID = composers.data[i].ID;
      }
    }
  }
  return composerID;
}

