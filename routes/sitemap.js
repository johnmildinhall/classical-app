var async = require('async');
var helper = require('./helper.js');
var composers = require('../composer-data.js');
var urlRoot = "http://www.falala.co/";

exports.page = function(req, res){
	var sitemap = "";
	var thisComposer = null;
	for ( var i in composers.data ){
		thisComposer = encodeURIComponent(composers.data[i].Composer);
		sitemap += urlRoot+"composers/"+thisComposer+"<br>";
	}

  async.parallel({
    catalogue: function(callback){
      setTimeout(function(){
        var composerIDs = [];
        // composers.data.forEach(function(thisComposer){ //get array of IDs
        // composerIDs.push(thisComposer.ID);
        // })
        Catindex.find({},function(err,data){
          console.log(data.length);
          var catArray = {};
          var composerID = null;
          var composerName = null;
          var url = null;
          data.forEach(function(thisOne){
            composerID = thisOne.itemID.substr(0,22);
            itemID = composerID+thisOne.symbol;
            //console.log(itemID);
            if(!catArray[itemID]){
              composerName = encodeURIComponent(helper.composerLongName(composerID));
              url = urlRoot+"composers/"+composerName+"/cat/"+thisOne.symbol;
              catArray[itemID] = url;
            }
          });
					//console.log(catArray);
					var cataloguePages = "";
					for ( var i in catArray){
						cataloguePages+= catArray[i]+"<br>";
					}
					callback(null, cataloguePages);
				}).lean();		
			},100);
		},
		artists: function(callback){
			setTimeout(function(){
				ArtistIndex.find({}, function(err,data){
					var artists = "";
					data.forEach(function(thisOne){
						artists += urlRoot+"artists/"+ encodeURIComponent(thisOne.name)+"<br>";
					});
					callback(null, artists);
				}).lean();	
			},100);
		},
		events: function(callback){
      setTimeout(function(){
				var rightNow = Math.floor(Date.now() / 1000);
				var oneYear = rightNow+(2629743*12);
				var concerts = "";
        Concert.find({'date.utc':{
            $gt:rightNow
          , $lt:oneYear}},function(err, data){
              data.forEach(function(thisOne){
                concerts+= urlRoot+"concerts/"+thisOne._id+"<br>";
              });
          callback(null, concerts);
        }).lean();
			},100);
    }
  },
    function (err, results) {
			console.log(results.catalogue);
			sitemap+=results.catalogue+results.artists+results.events;
			res.send(sitemap);
    }
  );


	
};