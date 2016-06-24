var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

   

var Schema = require('./models/models.js');
var c = Schema.connect();
//console.log(c);


// Use the schema to register a model with MongoDb
Composer = mongoose.model('Composer', Schema.composer);
Track = mongoose.model('Track', Schema.trackSchema);
Album = mongoose.model('Album',Schema.albumSchema);
Artist = mongoose.model('Artist',Schema.artistSchema);
Concert = mongoose.model('Concert',Schema.concertSchema);
Catalogue = mongoose.model('Catalogue',Schema.catalogueSchema);
Catindex = mongoose.model('Catindex',Schema.catindex);
featuredIndex = mongoose.model('featuredIndex',Schema.featuredIndex);
ArtistIndex = mongoose.model('ArtistIndex', Schema.artistIndexSchema);
mrArtist = mongoose.model('mrArtist', Schema.mrArtistSchema, 'mrArtists');
mrAlbum = mongoose.model('mrAlbum', Schema.mrAlbumSchema, 'mrAlbums');

//console.log(mongoose.connection.readyState);


//Routes
var home = require('./routes/home.js');
var composer = require('./routes/composer.js');
var album = require('./routes/album.js');
var artist = require('./routes/artist.js');
var albumPage = require('./routes/albumPage.js');
var concert = require('./routes/concert.js');
var search = require('./routes/search.js');
var catalogue = require('./routes/catalogue.js');
var dev = require('./routes/dev.js');
var sitemap = require('./routes/sitemap.js');

var app = express();

//Use Jade as the templating engine
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'))
    .use(cookieParser());
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



//Pages
app.get('/', home.page);
//composers
app.get('/composers', composer.list);
app.get('/composers/:composer', composer.page);
app.get('/composers/:composer/albums/:albumID', albumPage.page);
app.get('/composers/:composer/cat', catalogue.catPage );
app.get('/composers/:composer/cat/:symbol', catalogue.catPage);
app.get('/composers/:composer/cat/:symbol/:work', catalogue.catPage);
app.get('/composers/:composer/cat/:symbol/:work/:suffix', catalogue.catPage);
app.get('/composers/:composer/cat/:symbol/:work/:suffix/:postfix', catalogue.catPage);
app.get('/composers/:composer/edit', composer.composerEdit );
//artists
app.get('/artists', artist.list);
app.get('/artists/:artist', artist.page);
app.get('/artists/:artist/albums/:albumID', albumPage.page);
//albums
app.get('/albums/:albumID', albumPage.page);
//concerts
app.get('/concerts/:concertID', concert.page);
app.get('/concerts', concert.list);
//sitemap
app.get('/sitemap.txt', sitemap.page);



//Endpoints

//General search
app.get('/search-artist/:searchString', search.searchArtist);
app.get('/search-composer/:searchString', search.searchComposer);
app.get('/search-album/:searchString', search.searchAlbum);
app.get('/search-track/:searchString', search.searchTrack);
app.get('/search-catalogue/:searchString', search.searchCatalogue);
//get more albums
app.get('/composer-albums/:id/:offset', composer.albums);
app.get('/artist-albums/:id/:offset', artist.albums);
//Albums tracks for overlay
app.get('/album-tracks/:id', album.tracks);
//get more artists and composers on artist and composer pages
app.get('/composer-related-artists/:id/:offset', composer.related);
app.get('/composer-most-recorded/:id/:offset',composer.mostRecorded);
app.get('/artist-related-artists/:id/:offset', artist.related);
app.get('/artist-most-recorded/:id/:offset',artist.mostRecorded);
//get more artists and composers for list pages
app.get('/artist-list/:offset', artist.listMore);
app.get('/composer-list/:offset', composer.listMore);
//edit composers
app.post('/composer-update/:id', composer.updateData);

//for development purposes
app.get('/style-guide', dev.styleGuide);

///////////////////////
//Handle closing node//
///////////////////////
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


//Run the app

var port = Number(process.env.PORT || 3000)
console.log('Listening on '+port);
app.listen(port);
