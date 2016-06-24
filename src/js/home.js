function clickAlbumPlay(){
	var albumPlay = document.getElementsByClassName('featuredInnerPlay')[0];
	albumPlay.addEventListener('click', function(){
		//alert('click');
		audio.src = this.dataset.preview;
		audio.play();
		this.className = "featuredInnerPlay hidden";
		var showPause = document.getElementsByClassName('featuredInnerPause')[0];
		showPause.className = "featuredInnerPause";

		setTimeout(function(){
			var showPlay = document.getElementsByClassName('featuredInnerPlay')[0];
			showPlay.className = 'featuredInnerPlay';
			showPause.className = "featuredInnerPause hidden";
		},30000);
	});
}

function clickAlbumPause(){
	var albumPause = document.getElementsByClassName('featuredInnerPause')[0];
	albumPause.addEventListener('click', function(){
		audio.pause(); 
		albumPause.className = 'featuredInnerPause hidden';
		var showPlay = document.getElementsByClassName('featuredInnerPlay')[0];
		showPlay.className = 'featuredInnerPlay';
	});
}