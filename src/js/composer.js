function clickMoreComposers(){
	var moreComposers = document.getElementById('moreComposers');
	console.log(moreComposers);
	if(moreComposers){ //only do this if there's a more composers button
		moreComposers.addEventListener('click', function(){
			var thisButton = this;
			startLoader(thisButton);
			var thisID = document.getElementById('id-holder').innerHTML;
			var offset = document.getElementsByClassName('relatedBox').length;
			var request = new XMLHttpRequest();
			request.open('GET', '/composer-related-artists/'+thisID+'/'+offset, true);

			request.onload = function() {
				if (this.status >= 200 && this.status < 400) {
					var data = JSON.parse(this.response);
					console.log(data);

					for ( i = 0 ; i < data.length ; i++ ){
						var relatedBox = document.getElementsByClassName('relatedBox')[0].cloneNode(true);
						console.log(relatedBox);

						//background image
						relatedBox.getElementsByClassName('relatedImage')[0].setAttribute('style','background-image:url("'+data[i].imageSmall+'")');

						//name
						relatedBox.getElementsByClassName('relatedName')[0].innerHTML = data[i].name;

						//link
						relatedBox.getElementsByClassName('composerLink')[0].setAttribute('href','/composers/'+data[i].name);
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

function clickMoreBio(){
	var ellipsis = document.getElementsByClassName('ellipsis')[0];
	var more = document.getElementsByClassName('moreBio')[0];
	var second = document.getElementsByClassName('second')[0];
	more.addEventListener('click', function(){
		ellipsis.className = 'ellipsis hidden';
		more.className = 'moreBio hidden';
		second.className = 'second';
	})
}

function clickMoreArtists(){
	var moreArtists = document.getElementById('moreArtists');
	moreArtists.addEventListener('click', function(){
		var thisButton = this;
		startLoader(thisButton);
		var thisID = document.getElementById('id-holder').innerHTML;
		var offset = document.getElementsByClassName('relatedArtistBox').length;
		var request = new XMLHttpRequest();
		request.open('GET', '/composer-most-recorded/'+thisID+'/'+offset, true);

		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				var data = JSON.parse(this.response);
				console.log(data);

				for ( i = 0 ; i < data.length ; i++ ){
					var relatedArtistBox = document.getElementsByClassName('relatedArtistBox')[0].cloneNode(true);
					console.log(relatedArtistBox);

					//background image
					relatedArtistBox.getElementsByClassName('relatedImage')[0].setAttribute('style','background-image:url("'+data[i].imageSmall+'")');

					//name
					relatedArtistBox.getElementsByClassName('relatedArtistName')[0].innerHTML = data[i].artist;

					//link
					relatedArtistBox.getElementsByClassName('artistLink')[0].setAttribute('href','/artists/'+data[i].artist);
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









