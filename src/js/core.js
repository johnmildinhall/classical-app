//determine which page and act accordingly
document.addEventListener("DOMContentLoaded", function(event) { 
	var pageType = document.getElementById('pageType').innerHTML;
	switch (pageType){
		case 'composer':
			trackPreview('play','pause');
			clickAlbums();
			closeOverlay();
			clickMoreAlbums("composer");
			clickMoreComposers();
			clickMoreArtists();
			clickMoreBio();
			break;
		case 'artist':
			trackPreview('play','pause');
			clickAlbums();
			closeOverlay();
			clickMoreAlbums("artist");
			clickMoreRecordedComposers();
			clickMoreRelatedArtists();
			break;
		case 'home':
			clickAlbumPlay();
			clickAlbumPause();
			break;
		case 'catalogue':
			trackPreview('play','pause');
			break;
		case 'artistList':
			artistList();
			break;
		case 'composerList':
			composerList();
			break;
		case 'edit':
			changeListen();
	}
});

window.audio = document.createElement('audio');

function trackPreview(){

	//get rid of any previous listeners


	var playButtons = document.getElementsByClassName("play");
	for (var i = 0; i < playButtons.length; i++) {
		playButtons[i].removeEventListener('click', clickToPlay, false);
		playButtons[i].addEventListener('click', clickToPlay, false);
	}
	var pauseButtons = document.getElementsByClassName("pause");
	for ( i = 0 ; i < pauseButtons.length; i++){
		pauseButtons[i].removeEventListener('click', clickToPause, false);
		pauseButtons[i].addEventListener('click', clickToPause, false);
	}
}

//add play listener to play buttons
function clickToPlay() {
	resetPlayButtons();
  var thisID = (this.id);
  audio.src = this.dataset.preview;
  audio.play();
  this.className = "play hidden";
  console.log('#'+thisID + ' .pause');
  var toPause = document.querySelectorAll('#'+thisID+'.pause');
  toPause[0].className = 'pause';
  console.log(toPause);

  //revert to play after 30s
  setTimeout(function(){
    document.getElementById(thisID).className = "play";
  },30000);
}

function clickToPause(){
	var thisID = (this.id);
	audio.pause(); 
	this.className = "pause hidden";
	var toPlay = document.querySelectorAll('#'+thisID+'.play');
	toPlay[0].className = 'play';
}

function resetPlayButtons(){
	var playButtons = document.getElementsByClassName("play");
	var i = playButtons.length;
	while (i--){
		//console.log(i);
		playButtons[i].className = "play";
	}
	var pauseButtons = document.getElementsByClassName("pause");
	i = playButtons.length;
	while (i--){
		pauseButtons[i].className = "pause hidden";
	}
}

//Get more albums if click on more albums button
function clickMoreAlbums(composerOrArtist){
	var moreAlbums = document.getElementById('moreAlbums');
	if(moreAlbums){
		moreAlbums.addEventListener('click', function(){
			var thisButton = this;
			//get number of albums, plus Composer ID
			var offset = document.getElementsByClassName('albumBox').length;
			var thisID = document.getElementById('id-holder').innerHTML;

			startLoader(thisButton);

			//Check whether composer or artist
			var url = null;
			if (composerOrArtist === "composer"){
				url = '/composer-albums/';
			}else{
				url = '/artist-albums/';
			}
			console.log(url+thisID+'/'+offset);


			//Look up album by ID
			var request = new XMLHttpRequest();
			request.open('GET', url+thisID+'/'+offset, true);

			request.onload = function() {
				if (this.status >= 200 && this.status < 400) {
					var data = JSON.parse(this.response);
					console.log(data);

					//loop through and add new albums
					for ( i = 0 ; i < data.length ; i++ ){
						var currentAlbums = document.getElementsByClassName("albumBox");
						var newAlbum = currentAlbums[0].cloneNode(true);

						//ID
						newAlbum.setAttribute('id', data[i].ID);
						//background image
						var bgImage = newAlbum.getElementsByClassName("albumBoxInner");
						bgImage[0].setAttribute('style', 'background-image: url("'+data[i].image+'")');
						//Title
						//var title = newAlbum.getElementsByClassName("albumName")[0];
						//title.innerHTML = data[i].name;

						var theseAlbums = document.querySelectorAll('.albums.ag')[0];
						theseAlbums.appendChild(newAlbum);					
					}
					clickAlbums();
					stopLoader(thisButton);
					
					//if we've got to end of albums, remove more albums button
					if ( data.length < 8 ){
						console.log("remove");
						removeButton(thisButton);
					}

				} else {
				// We reached our target server, but it returned an error
				}
			};
			request.onerror = function() {
				// There was a connection error of some sort
			};

			request.send();
		});
	}
}

//Open the overlay if an album is clicked
function clickAlbums(){
	var albums = document.getElementsByClassName("albumBox");

	for (var i = 0; i < albums.length; i++) {
		albums[i].removeEventListener('click', function(){
			openAlbumOverlay(this.id);
		});
		albums[i].addEventListener('click', function(){
			openAlbumOverlay(this.id);
		});
	}
}

function openAlbumOverlay(thisID){

	//Look up album by ID
	var request = new XMLHttpRequest();
	//console.log('../album-tracks/'+thisID);
	request.open('GET', '/album-tracks/'+thisID, true);


	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			// Success!
			var data = JSON.parse(this.response);
			console.log(data);

			//Load in Data to Overlay
			var title = document.getElementsByClassName("olAlbumTitle");
			title[0].innerHTML = data.name;

			//link to album page
			console.log(document.getElementsByClassName("olAlbumLink")[0]);
			var currentURL = window.location.href;
			document.getElementsByClassName("olAlbumLink")[0].innerHTML = '<a href ="'+currentURL+'/albums/'+data._id+'">Go to album page</a>';

			//album composer
			document.getElementsByClassName("olAlbumComposer")[0].innerHTML = data.composers;

			for ( var i in data.tracks){
				console.log(data.tracks[i].name);
				var newTrack = document.getElementsByClassName("olTrack p")[0].cloneNode(true);
				newTrack.className = "olTrack";

				//track name 
				var name = newTrack.getElementsByClassName("topTrackName");
				name[0].innerHTML = data.tracks[i].name;

				//track artists
				var artists = newTrack.getElementsByClassName("topTrackArtist ol");
				//console.log(artists);
				artists[0].innerHTML = data.tracks[i].artists;

				//track composer
				var composer = newTrack.getElementsByClassName("composer ol");
				composer[0].setAttribute('href',data.tracks[i].composerLink);
				composer[0].innerHTML = data.tracks[i].composer;

				//play/pause
				var play = newTrack.getElementsByClassName("play");
				play[0].id = "a"+data.tracks[i].ID;
				play[0].setAttribute('data-preview',data.tracks[i].preview_url);
				var pause = newTrack.getElementsByClassName("pause");
				pause[0].id = "a"+data.tracks[i].ID;

				document.querySelectorAll('.olAlbumBody')[0].appendChild(newTrack);
			}
			//get them to play
			console.log("click to play");
			trackPreview();
			console.log(data);
		} else {
			// We reached our target server, but it returned an error

		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
	};

	request.send();

	//Open up overlay
	console.log(thisID);
	var bg = document.getElementsByClassName("bgOverlay");
	i = bg.length;
	while ( i-- ){
		bg[i].className = "bgOverlay fadein";
	}
	var al = document.getElementsByClassName("albumOverlay");
	i = al.length;
	while ( i-- ){
		al[i].className = "albumOverlay slideout";
	}
}

function closeOverlay(){
	var bg = document.getElementsByClassName("bgOverlay");
	bg[0].addEventListener('click', function(){
		close();
	});

	var closeWhite = document.getElementsByClassName('closeWhite');
	closeWhite[0].addEventListener('click', function(){
		close();
	})

	function close(){
		//remove all tracks
		console.log("remove tracks");
		document.querySelectorAll('.olTrack:not(.p)').remove();

		var bg = document.getElementsByClassName("bgOverlay");
		i = bg.length;
		while ( i-- ){
			bg[i].className = "bgOverlay hidden";
		}
		var al = document.getElementsByClassName("albumOverlay");
		i = al.length;
		while ( i-- ){
			al[i].className = "albumOverlay slidein";		
	}

	}
}

//start a loading animation
function startLoader(element){
	//console.log(element);
	element.className = "button loading";
	var buttonInner = element.getElementsByClassName('buttonInner');
	buttonInner[0].className = "buttonInner hidden";
	var loader = element.getElementsByClassName("loader");
	loader[0].className = "loader"; //show loader	
}

//stop a loading animation
function stopLoader(element){
	element.className = "button";
	var buttonInner = element.getElementsByClassName('buttonInner');
	buttonInner[0].className = "buttonInner";
	var loader = element.getElementsByClassName("loader");
	loader[0].className = "loader hidden"; //show loader	
}

//remove the button if no longer needed
function removeButton(element){
	element.remove();
}

function callAPI(url, searchString, callback){
	//Get artists
	var request = new XMLHttpRequest();
	console.log('/'+url+'/'+searchString);
	request.open('GET', '/'+url + '/' + searchString, true);
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			var data = JSON.parse(this.response);
			console.log(data);
			callback(data);
		}else{
			console.log(this.status);
		}
	};
	request.onerror = function() {
		console.log("there has been an error");
		// There was a connection error of some sort
	};
	request.send();	
}

function updateCall(url, data, ID, callback){
	var http = new XMLHttpRequest();
	var url = '/'+url+'/'+ID;
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/json");

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	    		//var data = JSON.parse(this.response);
	        callback(this.response);
	    }
	}
	http.send(data);
}

//Function to add in composers to list pages
function addGridItems(data){
	console.log(data);
	for ( i = 0 ; i < data.length ; i++ ){
		var currentComposers = document.getElementsByClassName("grid-item");
		var newGridItem = currentComposers[0].cloneNode(true);
		//console.log(newGridItem);
		//ID
		newGridItem.setAttribute('id', data[i]._id);
		//background image
		newGridItem.setAttribute('style', data[i].images);
		//Title
		var title = newGridItem.getElementsByClassName("composer")[0];
		title.innerHTML = data[i].name;
		//link
		var link = newGridItem.getElementsByClassName("relatedComposerLink")[0];
		link.setAttribute('href', data[i].href);

		var grid = document.getElementsByClassName('grid')[0];
		grid.appendChild(newGridItem);	
	}
}



//Make it easier to remove DOM elements

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};
