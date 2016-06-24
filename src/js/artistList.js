function artistList(){
	var moreButton = document.getElementById('moreArtists');
	moreButton.addEventListener('click', getMoreArtists, false);
}

function getMoreArtists(){
	console.log('moreArtists');
	var offset = document.getElementsByClassName('grid-item').length;
	console.log(offset);
	var url = 'artist-list';
	callAPI(url , offset , addGridItems );
}
