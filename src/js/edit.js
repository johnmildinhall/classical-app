function changeListen(){
	var ID = document.getElementsByClassName('id-holder')[0].innerHTML;
	var inputs = document.getElementsByTagName('input');
	var textareas = document.getElementsByTagName('textarea');

	for ( i = 0 ; i < inputs.length ; i++ ){
		inputs[i].addEventListener('input', function (evt) {
			getForm(ID);
		});
	}

	for ( i = 0 ; i < textareas.length ; i++ ){
		//console.log(textareas[i]);
		textareas[i].addEventListener('input', function (evt) {
			getForm(ID);
		});
	}
}

function getForm(ID){
	var inputs = document.getElementsByTagName('input');
	var textareas = document.getElementsByTagName('textarea');
	var data = {};
	for ( j = 0 ; j < inputs.length ; j++ ){
		//console.log( inputs[j].className + " "+ inputs[j].value );
		data[inputs[j].className] = inputs[j].value;
	}
	for ( j = 0 ; j < textareas.length ; j++ ){
		data[textareas[j].className] = textareas[j].value;
	}
	console.log(data);
	data = JSON.stringify(data);
	updateCall('composer-update', data, ID, getResponse);

}

function getResponse(data){
	console.log('response: '+ data );
}