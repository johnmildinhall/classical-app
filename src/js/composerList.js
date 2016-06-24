function composerList(){
	var moreButton = document.getElementById('moreComposers');
	moreButton.addEventListener('click', getMoreComposers, false);
}

function getMoreComposers(){
	console.log('moreComposers');
	var offset = document.getElementsByClassName('grid-item').length;
	console.log(offset);
	var url = 'composer-list';
	callAPI(url , offset , addGridItems );
}
