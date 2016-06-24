exports.headData = function (pageType, entity, id){
  var nameSplit = '';
  if(entity){
    nameSplit = entity.split(" ");
  }
  function addToKeywords(keywords, nameToSplit){
    for (var i in nameToSplit){
      keywords += ', '+ nameToSplit[i];
    }
    return keywords;
  }

  var description = '';
  var keywords = '';
  var url = '';
  var title = '';

  switch(pageType){
    case 'home':
      description = "Falala is a classical music app. It organises classical music according to composers and their catalogues. It also includes artists who play classical music, along with classical music concerts.";
      keywords = "composer, classical, music, catalogue, symphony, concerto, concerts, events, audio";
      url = "http://www.falala.co";
      title = "falala | Discover Classical";
      break;    
    case 'composer':
      description = "The composer " +entity + "'s recorded catalogue, along with albums, concerts, top tracks, artists who have recorded "+entity+", and related composers";
      keywords = "composer, classical, music, catalogue, symphony, concerto, concerts, events, audio";
      keywords = addToKeywords(keywords, nameSplit);
      url = "http://www.falala.co/composers/"+encodeURI(entity);
      title = "falala | "+entity;
      break;
    case 'artist':
      description = "The classical music artist "+entity+"'s top tracks, albums, related artists and favourite composers, along with upcoming concerts";
      keywords = "artist, musician, classical, music, audio, events";
      keywords = addToKeywords(keywords, nameSplit);
      url = "http://www.falala.co/artists/"+encodeURI(entity);
      title = "falala | "+entity;
      break;
    case 'concert':
      description = entity+ ": a classical music concert";
      keywords = "classical, music, concert, symphony, concerto, recital, event, composer";
      keywords = addToKeywords(keywords, nameSplit);
      url = "http://www.falala.co/concerts/"+id;
      title = "falala | "+entity;
      break;
    case 'composerList':
      description = "A list of classical and romantic composers";
      keywords = " classical, music, concert, symphony, concerto, recital, event, composer";
      url = "http://www.falala.co/composers/";
      title = "falala | Composers";
      break;
    case 'artistList':
      description = "A list of classical musicians, orchestras, choirs and chamber groups";
      keywords = " classical, music, concert, symphony, concerto, recital, event, composer, artists, conductors, violinists, soloists, chamber groups";
      url = "http://www.falala.co/artists/";
      title = "falala | Artists";
      break;
    case 'concertList':
      description = "A list of upcoming classical music concerts";
      keywords = " classical, music, concert, symphony, concerto, recital, event, composer, artists, conductors, violinists, soloists, chamber groups";
      url = "http://www.falala.co/concerts/";
      title = "falala | Concerts";
      break;  
    case 'album':
      description = entity+ ": Listen to the album";
      keywords = "classical, music, concert, symphony, concerto, recital, event, composer, artists, conductors, violinists, soloists, chamber groups";
      keywords = addToKeywords(keywords, nameSplit);
      url = "http://www.falala.co/albums/"+id;
      title = "falala | " + entity;

  }
  var headData = {
      title : title
    , keywords : keywords
    , description : description
    , abstract : description
    , topic : description
    , summary : description 
    , url : url
  };
  return headData;
};

exports.asBackground = function (url){
	return ('background-image:url("'+url+'");');
};
//function to take Spotify Image data structure and return the specified image width
exports.getImageSize = function (images,lowerLimit,upperLimit, biggest, imageLarge, imageMedium){
  //console.log(imageMedium);
  //console.log("Image Large: "+imageLarge);
  if(typeof imageLarge!='undefined'){
    if(imageLarge!='undefined'){
      //console.log("returning ImageLarge");
      return imageLarge;      
    }

  }
  if(typeof imageMedium!='undefined'){
    if(imageMedium!='undefined'){
      //console.log("returning Image Medium");
      return imageMedium;
    } 
  } 

  function compare(a,b) {
    if (a.area > b.area)
      return -1;
    if (a.area < b.area)
      return 1;
    return 0;
  }
  
  if(biggest === true){

    var imageOut = [];


    for ( var j in images ){
      var a = parseInt(images[j].height) * parseInt(images[j].width);
      var b = images[j].url;
      imageOut.push({
          area : a
        , url : b 
      });
    }


    imageOut.sort(compare);


    if(imageOut.length < 1){
      return("");
    }else{
      return(imageOut[0].url);
    }
  }else{
    for ( var k in images ){

      if(images.hasOwnProperty(k)){
          //console.log('IMAGES £££££££££');
          if(typeof images[k] != 'undefined'){
            //console.log(images[j]);            
          }

          if ( images[k].width > lowerLimit & images[k].width < upperLimit ){
                return images[k].url;
          }
      }
   }
  }

};

asComposerLink = function(composer){
  composer = encodeURI(composer);
  //console.log(composer);
  return "/composers/"+composer;
};
exports.asComposerLink = asComposerLink;

asArtistLink = function(artist){
  artist = encodeURI(artist);
  return "/artists/"+artist;
};
exports.asArtistLink = asArtistLink;


//get html list of artists for concerts from array of artists
exports.getArtistList = function(artists){
  // console.log("aaa");
  // for (i in artists){
  //   for (j in artists[i]){
  //     console.log(artists[i][j]);
  //   }
    
  // }
  // console.log("www");
  var theseArtists = '';
  if(artists.length>0){ //if there are any artists add as a list
    theseArtists = '<a href="'+asArtistLink(artists[0].name)+'">'+artists[0].name+'</a>';
    for ( j = 1 ; j < artists.length ; j++){
      theseArtists = theseArtists + ', '+'<a href="'+asArtistLink(artists[j].name)+'">'+artists[j].name+'</a>';
    }   
  }  
  return theseArtists;
};

//return an html composer list from an array
exports.getComposerList = function(composers){
  //console.log(composers);

  if(composers.length === 0){
    return null;
  }else{
    var theseComposers = '<a class = "concertComposerLink" href="'+asComposerLink(composers[0].shortName)+'">'+composers[0].shortName+'</a>';
    for ( k = 1 ; k < composers.length ; k++){
      if( k === composers.length - 1){
        theseComposers = theseComposers + ' & '+'<a class = "concertComposerLink" href="'+asComposerLink(composers[k].shortName)+'">'+composers[k].shortName+'</a>';
      }else{
        theseComposers = theseComposers + ', '+'<a class = "concertComposerLink" href="'+asComposerLink(composers[k].shortName)+'">'+composers[k].shortName+'</a>';
      } 
    } 
    return theseComposers;    
  }

};

exports.addCatLink = function(name, composer){

  var appRoot = process.cwd();
  var cat = require(appRoot+'/cat-abbr.js');

  //check if Op first;
  var regex = new RegExp(" Op\\.? ?([1-9]\\d*)(:|,|\/)? ?(nr\\.?|Nr\\.?|Variation|Var\\.?|Act|No\\.?)? ?([1-9]\\d*|(IX|IV|V?I{0,3}))"); 
  var catalogue = name.match(regex);
  //console.log(catalogue);

  //if there's no Op number
  if( catalogue === null ){
    for ( var i in cat.data ){

      //console.log(cat.data[i].abbreviation);
      regex = new RegExp(" " + cat.data[i].abbreviation + "\\.? ?([1-9]\\d*)(:|,|\/)? ?(nr\\.?|Nr\\.?|Variation|Var\\.?|Act|No\\.?)? ?([1-9]\\d*|(IX|IV|V?I{0,3}))"); 
      catalogue = name.match(regex);
      //console.log(catalogue);
      if( catalogue !== null ){
        name = updateSpan(name, catalogue, cat.data[i].abbreviation, composer);
        return name;
      }
      //console.log(catalogue);
    }
    return name;    //return the original if there is nothing
  }else{ 
    if( catalogue !== null ){ //if there is an Op number
      name = updateSpan(name, catalogue, 'Op', composer);
      return name;
    }
  }

};

function updateSpan(name, catalogue, abbreviation, composer){
    //console.log(composer);
    name = [name.slice(0, catalogue['index']+catalogue[0].length), "</a>", name.slice(catalogue['index']+catalogue[0].length)].join('');
    name = [name.slice(0, catalogue['index']+1), "<a href = '/composers/"+composer+"/cat/"+abbreviation+"/"+catalogue[1]+"/"+catalogue[4]+"' class='catLink orange-bold'>", name.slice(catalogue['index']+1)].join('');   
    return name;
}

exports.getRandomPreviewURL = function(tracks){
  var rando = Math.floor((Math.random() * tracks.length));
  return tracks[rando].preview_url;
};

exports.msUntilMidnight = function () {
    var midnight = new Date();
    midnight.setHours( 24 );
    midnight.setMinutes( 0 );
    midnight.setSeconds( 0 );
    midnight.setMilliseconds( 0 );
    return ( midnight.getTime() - new Date().getTime() );
};

exports.randomQuote = function(quotes){
  var random = Math.floor((Math.random() * quotes.length));
  //console.log(quotes[rando]);
  var quoteData = null;
  if(quotes[random].quotes.length > 1){
    var random2 = Math.floor((Math.random() * quotes[random].quotes.length));

    quoteData = {
        ID : quotes[random].id
      , name : quotes[random].name
      , quotes : [quotes[random].quotes[random2]]
      , images : quotes[random].images
      , shortName : quotes[random].shortName
      , imageMedium : quotes[random].imageMedium
      , imageLarge : quotes[random].imageLarge
    };
  }else{
    quoteData = quotes[random];
  }
  return quoteData;
};

exports.randomFeaturedAlbum = function(albums){
  var random = Math.floor((Math.random() * albums.length));
  return albums[random]._id;
};

exports.randomQuoteForComposer = function (quotes){
  var random = Math.floor((Math.random() * quotes.length));
  return quotes[random];
};

exports.ellipsis = function(string, limit){
  if(typeof string != 'undefined'){
    if(string.length > limit){
      return string.substr(0,limit).trim()+'\u2026';
    }else{
      return string;
    }    
  }else{
    return string;
  }

};

exports.composerCheck = function(composer, res){
  var composerID = null;
  var composers = require('../composer-data.js');
  for(i=0;i<composers.data.length;i++){
    //console.log(composers.data[i].Composer);
    if(composers.data[i].Composer===composer|composers.data[i].shortName===composer){
      composerID = composers.data[i].ID;
      console.log("Composer found: "+ composerID+" "+composers.data[i].Composer);
      return composerID;
    }
  }
  //console.log(composerID);
  if(composerID===null){
    res.render('not-found.jade', { title: "Not found", searchTerm: composer });
  }
  
};

exports.composerShortName = function(composerID){
  var composers = require('../composer-data.js');
  for ( var i in composers.data ){
    if(composers.data[i].ID === composerID ){
      return composers.data[i].shortName;
    }
  }
  return null;
};

exports.composerLongName = function(composerID){
  var composers = require('../composer-data.js');
  for ( var i in composers.data){
    if(composers.data[i].ID === composerID ){
      return composers.data[i].Composer;
    }
  }
  return null;
};



exports.roman_to_int = function (input) {
        var digits = [["I", "V"], ["X", "L"], ["C", "D"], ["M"]],
        templates = ["", "o", "oo", "ooo", "of", "f", "fo", "foo", "fooo", "ot"],
        i, pos = 0,
        result = 0,
            get_one_power_of_ten = function (str, pos, current_pot) {
                // Current power-of-ten accumulator: collects characters belonging to one power-of-ten. Eg: "IX", "VII", etc.
                var i, current_pot_acc = "",
                    numeral_to_template = function (ch) {
                        // converts char ch to power-of-ten idependant template character.
                        if (ch === digits[current_pot][0]) {
                            return "o";
                        }
                        if (ch === digits[current_pot][1]) {
                            return "f";
                        }
                        // we also allow for the "X" in something like "IX". (representations of 9*10^n).
                        if ((current_pot < (digits.length - 1)) && (current_pot_acc === "o") && (ch === digits[current_pot + 1][0])) {
                            return "t";
                        }
                        return "";
                    };
                for (i = pos; i < input.length; i++) {
                    if (numeral_to_template(input.charAt(i)) !== "") {
                        current_pot_acc += numeral_to_template(input.charAt(i));
                        pos++;
                    } else {
                        break;
                    }
                }
                return [current_pot_acc, pos];
 
            };
 
        input = input.toUpperCase();
        for (i = digits.length - 1; i >= 0; i--) {
            // we iterate over the powers of ten in decreasing order, starting with 3 (which is 1000).
            var templ_ix, pot = get_one_power_of_ten(input, pos, i);
            pos = pot[1], templ_ix = templates.indexOf(pot[0]);
            if (templ_ix === -1) {
                throw ("invalid roman numeral");
            } else {
                result += templ_ix * Math.pow(10, i);
            }
        }
        if (pos !== input.length) throw ("invalid char at position " + pos);
        return result;
    },
exports.int_to_roman = function (num) {
        var i, digit, pot, result = "",
            num_ms = 0,
            re = [/o/g, /f/g, /t/g],
            templ;
        if (typeof(num) !== "number" || !isFinite(num)) throw "into_to_roman requires a valid integer as input";
        // Anything >= 1000 just becomes "M"
        for (num_ms = Math.floor(num / 1000); num_ms > 0; num_ms--) {
            result += "M";
        }
        // for powers of ten below 3, we subsitute in the applicable template
        for (pot = 2; pot >= 0; pot--) {
            digit = Math.floor((num % (Math.pow(10, pot + 1))) / Math.pow(10, pot));
            templ = String(templates[digit]);
            templ = templ.replace(re[0], digits[pot][0]);
            templ = templ.replace(re[1], digits[pot][1]);
            templ = templ.replace(re[2], digits[pot + 1][0]);
            result += templ;
        }
        return result;
    };