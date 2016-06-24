var helper = require('./helper.js');

//concert page
exports.page = function(req, res){
  var id = req.param("concertID");
  console.log(id);
  Concert.findOne({'_id':id}, function(err,data){
      if(err){console.log(err);}
      if(data.length === 0){
        res.render('not-found.jade', { title: "Not found", searchTerm: id });
      }else{
        console.log(data);
        data.artists = helper.getArtistList(data.artists);
        data.composers = helper.getComposerList(data.composers);
        data.image = helper.asBackground(data.image);
        //get head data
        var head = helper.headData('concert' , data.title, data._id);
        res.render('concert.jade', { 
            head : head
          , data : data 
        });
      }   
    }).lean();
};

exports.list = function(req,res){

  var rightNow = Math.floor(Date.now() / 1000);
  var oneMonth = rightNow+2629743;
  Concert.find({'date.utc':{
              $gt:rightNow
            , $lt:oneMonth}},function(err, data){
    console.log(data[0]);

    for ( i = 0 ; i < data.length ; i++){
      data[i].image = helper.asBackground(data[i].image);
      data[i].artistList = helper.getArtistList(data[i].artists);
      data[i].composerList = helper.getComposerList(data[i].composers);
      data[i].page = "/concerts/"+data[i]._id;
    }
    //featured upcoming concert
    var upcoming = data[0];

    //the rest of the concerts
    data.shift();

    var head = helper.headData('concertList', null, null);

    res.render('concertList.jade', { 
        head : head
      , upcoming : upcoming 
      , concerts : data
    });
  }).limit(10).sort({'date.utc':1}).lean();
  
};

//get concerts for a specific composer
exports.composers = function(req,res){
  
  var id = req.param("id");

  var rightNow = Math.floor(Date.now() / 1000);
  var oneYear = rightNow+(12*2629743);
  
  Concert.find(
    {
        'composers.ID':id
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
      res.send(data);
    }
  );


};

exports.artists = function(req,res){
  
  var id = req.param("id");
  var rightNow = Math.floor(Date.now() / 1000);
  var oneYear = rightNow+(12*2629743);
  Concert.find(
    {
        'artists.ID':id
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
      , 'venue':1
      , 'image':1
    },{
          skip:0
        , sort:{
          'date.utc': 1 
        }
    },
    function(err,data){
      res.send(data);
    }
  );
};

exports.upcoming = function(req, res){
  // var rightNow = Math.floor(Date.now() / 1000);
  // console.log(rightNow);
  // var oneMonth = rightNow+2629743;
  // Concert.find(
  //   {'date.utc':{
  //       $gt:rightNow
  //     , $lt:oneMonth}},{
  //       '_id':1
  //     , 'title':1
  //     , 'subtitle':1
  //     , 'date':1,'price':1
  //     , 'composers':1
  //     , 'artists':1
  //     , 'url':1
  //     , 'venue':1
  //     , 'image':1
  //   },{
  //         skip:0
  //       , sort:{
  //         'date.utc': 1 
  //       }
  //   },
  //    function(err,data){
  //     res.send(data);
  //   }
  // );  
};