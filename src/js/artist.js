function clickMoreRecordedComposers(){
	var moreComposers = document.getElementById('moreComposers');
	if(moreComposers){
		moreComposers.addEventListener('click', function(){
			var thisButton = this;
			console.log(this);
			startLoader(thisButton);
			var thisID = document.getElementById('id-holder').innerHTML;
			var offset = document.getElementsByClassName('relatedBox').length;
			var request = new XMLHttpRequest();
			request.open('GET', '/artist-most-recorded/'+thisID+'/'+offset, true);

			request.onload = function() {
				if (this.status >= 200 && this.status < 400) {
					var data = JSON.parse(this.response);
					console.log(data);

					for ( i = 0 ; i < data.length ; i++ ){
						var relatedBox = document.getElementsByClassName('relatedBox')[0].cloneNode(true);
						console.log(relatedBox);

						//background image
						relatedBox.getElementsByClassName('relatedImage')[0].setAttribute('style',data[i].imageSmall);

						//name
						relatedBox.getElementsByClassName('relatedName')[0].innerHTML = data[i].composer;

						//link
						relatedBox.getElementsByClassName('composerLink')[0].setAttribute('href','/composer/'+data[i].composer);
						var related = document.querySelectorAll('.related.comp')[0];
						related.insertBefore(relatedBox, thisButton);

						if( data.length < 10 ){
							setTimeout(function(){ removeButton(thisButton); }, 3000);
							
						}
						//related.appendChild(relatedBox);
					}
					stopLoader(thisButton);

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

function clickMoreRelatedArtists(){
	var moreArtists = document.getElementById('moreArtists');
	moreArtists.addEventListener('click', function(){
		var thisButton = this;
		startLoader(thisButton);
		var thisID = document.getElementById('id-holder').innerHTML;
		var offset = document.getElementsByClassName('relatedArtistBox').length;
		var request = new XMLHttpRequest();
		request.open('GET', '/artist-related-artists/'+thisID+'/'+offset, true);

		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				var data = JSON.parse(this.response);
				console.log(data);

				console.log(data.length);
				for ( i = 0 ; i < data.length ; i++ ){
					var relatedArtistBox = document.getElementsByClassName('relatedArtistBox')[0].cloneNode(true);
					console.log(relatedArtistBox);

					//background image
					relatedArtistBox.getElementsByClassName('relatedImage')[0].setAttribute('style','background-image:url("'+data[i].imageSmall+'")');

					//name
					relatedArtistBox.getElementsByClassName('relatedArtistName')[0].innerHTML = data[i].name;

					//link
					relatedArtistBox.getElementsByClassName('artistLink')[0].setAttribute('href','/artists/'+data[i].name);
					var related = document.querySelectorAll('.related.art')[0];
					related.insertBefore(relatedArtistBox, thisButton);

					if( data.length < 10 ){
						setTimeout(function(){ removeButton(thisButton); }, 3000);
						
					}
					//related.appendChild(relatedBox);
				}
				stopLoader(thisButton);

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









