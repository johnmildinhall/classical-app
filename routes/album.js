var helper = require('./helper.js');
var composers = require('../composer-data.js');

exports.tracks = function(req, res){
	var id = req.param("id");
	console.log(id);

		Album.findOne({"_id":id}, function(err, data) {
      if (err) return console.error(err);
      console.log(data);
      data.composers = [];
			if( data !== null ){
				for (var i = 0 ; i < data.tracks.length ; i++){
					//console.log(data.tracks[i].artists);
					if(data.tracks[i].composer.length > 0){ 
						//add catalogue link if we know who the composer is
						data.tracks[i].name = helper.addCatLink(data.tracks[i].name,data.tracks[i].composer);
						//add composer to list of composers if not duplicate
						var found = false;
						for (var j in data.composers){
							if (data.composers[j].Composer === data.tracks[i].composer){found = true;}
						}
						if(found === false){
							for (var k in composers.data){
								if(data.tracks[i].composer === composers.data[k].Composer){
									data.composers.push(composers.data[k]);
								}
							}	
						}
						//make the composer a link
						data.tracks[i].composerLink = helper.asComposerLink(data.tracks[i].composer);
					}
					data.tracks[i].artists = helper.getArtistList(data.tracks[i].artists);
				}
				console.log(data.composers);
				//make the composer array an html list
				data.composers = helper.getComposerList(data.composers);
				res.send(data);
			}else{
				res.send(data);
			}
		}).lean();
};