document.addEventListener("DOMContentLoaded", function(event) {

	openClose();
	inputListen();
 });

// opening and closing the search overlay
function openClose(){
	var searchOpen = document.getElementsByClassName('search')[0];
	var searchClose = document.getElementsByClassName('close')[0];
	var searchOverlay = document.getElementsByClassName('searchOverlay')[0];
	searchOpen.addEventListener('click', function(){
		searchOverlay.className = 'searchOverlay searchSlidein';
	});
	searchClose.addEventListener('click', function(){
		clearResults();
		searchOverlay.className = 'searchOverlay searchSlideout';
	});
}

//Listening for typing
function inputListen(){
	var searchInput = document.getElementsByClassName('searchInput')[0];
	
	var timer = null;
	searchInput.onkeyup = function() {
    if (timer) {
        window.clearTimeout(timer);
    }
    timer = window.setTimeout(function(){
			var searchString = searchInput.value;
			if(searchString.length>2){
				clearResults();
				search(searchString);		
			}else{
				clearResults();
			}

    }, 500);
	};
}

//Once you update the search, you have to clear the results
function clearResults(){

	//remove existing results
	var toRemove = document.getElementsByClassName('toRemove');
	for ( var i in toRemove ){
		toRemove.remove();
	}

	//hide section titles
	var titles = document.getElementsByClassName('searchTitle');
	//console.log(titles);
	for ( i in titles){
		titles[i].className = 'searchTitle hidden';
	}

	//hide results panel
	var result = document.getElementsByClassName('result');
	result[0].className = 'result hidden';

}

function showResults(){
	document.getElementsByClassName('result')[0].className='result';
}

function search(searchString){
	//console.log('value = '+searchString);
		callAPI('search-composer',searchString, populateComposer);
		callAPI('search-artist',searchString, populateArtist);
		callAPI('search-album',searchString, populateAlbum);
		callAPI('search-track',searchString, populateTrack);
		//callAPI('search-catalogue', searchString, populateCatalogue);

}

function populateComposer(data){
	//console.log("Composer");
	//console.log(data);
	for (i = 0 ; i < data.length ; i++ ){
		var composer = document.querySelectorAll('.searchLink.composer.hidden')[0].cloneNode(true);
		composer.className = 'searchLink composer toRemove';

		composer.setAttribute('href','/composers/'+data[i].name);
		composer.getElementsByClassName('composerSearchName')[0].innerHTML = data[i].name;
		composer.getElementsByClassName('composerSearchImage')[0].setAttribute('style','background-image:url("'+data[i].imageSmall+'");');
		if(data[i].life){
			composer.getElementsByClassName('composerSearchLife')[0].innerHTML = data[i].life[0].birthYear + " - "+ data[i].life[0].deathYear;
		}
		

		var parent = document.querySelectorAll('.results.composer')[0];
		var reference = document.querySelectorAll('.searchLink.composer.hidden')[0];
		parent.insertBefore(composer, reference);
	}
	
	//show section title + results
	if(data.length>0){
		showResults();
		document.querySelectorAll('#composers.searchTitle')[0].className = 'searchTitle';
	}

}

function populateArtist(data){
	//console.log("artists");
	//console.log(data);
	for (i = 0 ; i < data.length ; i++){
		var artist = document.querySelectorAll('.searchLink.artist.hidden')[0].cloneNode(true);
		artist.className = 'searchLink artist toRemove';

		artist.setAttribute('href','/artists/'+data[i].name);
		artist.getElementsByClassName('artistSearchName')[0].innerHTML = data[i].name;
		artist.getElementsByClassName('artistSearchImage')[0].setAttribute('style','background-image:url("'+data[i].imageSmall+'");');	

		var parent1 = document.querySelectorAll('.results.artist')[0];
		var reference1 = document.querySelectorAll('.searchLink.artist.hidden')[0];
		
		//console.log(parent1);
		//console.log(artist);
		//console.log(reference1);
		//insertAfter(artist, reference);
		parent1.insertBefore(artist, reference1);
		
	}
	
	//show section title
	if(data.length>0){
		showResults();
		document.querySelectorAll('#artists.searchTitle')[0].className = 'searchTitle';
	}
}

function populateAlbum(data){
	//console.log("albums");
	//console.log(data);
	for (i = 0 ; i < data.length ; i++){
		var album = document.querySelectorAll('.searchLink.album.hidden')[0].cloneNode(true);
		album.className = 'searchLink album toRemove';

		album.setAttribute('href','/albums/'+data[i]._id);
		album.getElementsByClassName('albumSearchName')[0].innerHTML = data[i].name;
		album.getElementsByClassName('albumSearchImage')[0].setAttribute('style','background-image:url("'+data[i].image+'");');
		
		var parent = document.querySelectorAll('.results.album')[0];
		var reference = document.querySelectorAll('.searchLink.album.hidden')[0];
		parent.insertBefore(album, reference);
	}
	
	//show section title
	if(data.length>0){
		showResults();
		document.querySelectorAll('#albums.searchTitle')[0].className = 'searchTitle';
	}
}

function populateTrack(data){
	//console.log("tracks");
	//console.log(data);
	for (i = 0 ; i < data.length ; i++){
		var track = document.querySelectorAll('.searchTrack.hidden')[0].cloneNode(true);
		track.className = 'searchTrack toRemove';

		track.getElementsByClassName('trackName')[0].innerHTML = data[i].name;
		track.getElementsByClassName('play')[0].setAttribute('data-preview', data[i].preview_url);
		track.getElementsByClassName('play')[0].setAttribute('ID','a'+data[i]._id);
		track.getElementsByClassName('pause')[0].setAttribute('ID','a'+data[i]._id);

		var parent = document.querySelectorAll('.results.track')[0];
		var reference = document.querySelectorAll('.searchTrack.hidden')[0];
		parent.insertBefore(track, reference);
	}
	
	//show section title
	if(data.length>0){
		showResults();
		document.querySelectorAll('#tracks.searchTitle')[0].className = 'searchTitle';
	}

	//add event listener
	trackPreview();
}

function populateCatalogue(data){
	console.log("Cat: "+data);
}

