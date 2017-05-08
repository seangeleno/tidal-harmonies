$(document).ready(function() {

	console.log('ready');


	$.ajax({

		url: 'http://127.0.0.1/harmonics',
		method: 'GET',
		data: {
			lat: 20.9614,
			lon: -157.4121 
		}
	
	}).done(function(res) {

		//var id = parseInt(res[0].properties.ID);

		console.log(res);

	})


	// $.ajax({

	// 	url: 'http://127.0.0.1/harmonics',
	// 	method: 'GET',
	// 	data: {
	// 		id: 1611347
	// 	}
	
	// }).done(function(res) {

	// 	console.log(res);

	// })




})



