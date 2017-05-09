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



	// function makeSineWaves(arr) {
		
	// 	var width = $(window).width();
	// 	var height = $(window).height();

	// 	var frames = 0;
	// 	var phi = 0;

	// 	var container = document.getElementById('canvas-container');

	// 	var canvas = document.createElement('canvas');

	// 	var ctx = canvas.getContext("2d");

	// 	canvas.setAttribute('width', width);
	// 	canvas.setAttribute('height', height);

	// 	container.appendChild(canvas);

	// 	function draw() {
			
	// 		frames += .5;
	  
	//    		phi = that.frames / 240;

	// 		ctx.clearRect(0, 0, that.width, that.height);

	// 		ctx.lineWidth = that.lineWidth;
		  	
	// 	  	ctx.beginPath();

	// 	  	ctx.strokeStyle = 'rgb(0,0,'+ frames + ')';

	// 	  	ctx.moveTo(0, height);
		  
	// 	  	for (var x = 0; x < width; x++) {
		    	
	// 	    	y = Math.sin(x * freq + phi) * amp / 2 + amp / 2;

	// 	    	ctx.lineTo(x, y);

	// 	 	 }

	// 	 	 ctx.stroke();

	// 	 }
	// }




	// function SineWave(amp, phase, freq, id) {

	// 	this.width = $(window).width();
	// 	this.height = $(window).height();

	// 	this.amp = (amp * 5) * this.height;
	// 	this.phase = phase;
	// 	this.freq = freq;
	// 	this.id = id;
	// 	this.frames = 0;
	// 	this.phi = 0
	// 	this.x = 0;
	// 	this.y = 0;
	// 	this.lineWidth = 1;

	// 	container = document.getElementById('canvas-container');

	// 	var canvas = document.createElement('canvas');
	// 	canvas.setAttribute('id', this.id);

	// 	canvas.setAttribute('width', this.width);
	// 	canvas.setAttribute('height', this.height);

	// 	var ctx = canvas.getContext("2d");

	// 	container.appendChild(canvas);

	// 	that = this;

	// 	this.draw = function() {

	// 		this.frames+=.5;
	  
	//    		this.phi = that.frames / 240;

	// 		//ctx.clearRect(0, 0, that.width, that.height);

	// 		ctx.lineWidth = this.lineWidth;

	// 	  	ctx.beginPath();

	// 	  	ctx.strokeStyle = 'rgb(0,0,'+ that.frames + ')';
	// 	  	ctx.moveTo(0, that.height);
		  
	// 	  	for (that.x = 0; that.x < that.width; that.x++) {
		    	
	// 	    	that.y = Math.sin(that.x * that.freq + that.phi) * that.amp / 2 + that.amp / 2;

	// 	    	ctx.lineTo(that.x, that.y);

	// 	 	 }

	// 	 	 ctx.stroke();

	// 	 	 window.requestAnimationFrame(that.draw);

	// 	}

	// }


function drawWave1(amp, phase, freq) {

	var width = $(window).width();
	var height = $(window).height();

	var amp = amp * 1000;
	var phase = phase;
	var freq = freq;
	var frames = 0;
	var phi = 0
	var x = 0;
	var y = 0;
	var lineWidth = 1;

	var canvas = document.getElementById('canvas1');

	canvas.setAttribute('width',width);
	canvas.setAttribute('height',height);

	var ctx = canvas.getContext("2d");

	draw();


	function draw() {

		frames += .1;
	  
	   	phi = frames / 240;

		ctx.clearRect(0, 0, width, height);

		ctx.lineWidth =lineWidth;

		ctx.beginPath();

		ctx.strokeStyle = 'rgb(255,0,0)';
		ctx.moveTo(0, height);
		  
	  	for (x = 0; x < width; x++) {

	    	y = (Math.sin(x * freq + phi) * amp / 2 + amp / 2) + (height / 6);

	    	ctx.lineTo(x, y);

	 	 }

		ctx.stroke();

		window.requestAnimationFrame(draw);

	}

}



function drawWave2(amp, phase, freq) {

	var width = $(window).width();
	var height = $(window).height();

	var amp = amp * 1000;
	var phase = phase;
	var freq = freq;
	var frames = 0;
	var phi = 0
	var x = 0;
	var y = 0;
	var lineWidth = 1;

	var canvas = document.getElementById('canvas2');

	canvas.setAttribute('width',width);
	canvas.setAttribute('height',height);

	var ctx = canvas.getContext("2d");

	draw();


	function draw() {

		frames += .1;
	  
	   	phi = frames / 240;

		ctx.clearRect(0, 0, width, height);

		ctx.lineWidth = lineWidth;

		ctx.beginPath();

		ctx.strokeStyle = 'rgb(0,0,255)';
		
		ctx.moveTo(0, height);
		  
	  	for (x = 0; x < width; x++) {
	    	
	    	y = (Math.sin(x * freq + phi) * amp / 2 + amp / 2) + (height / 6);

	    	ctx.lineTo(x, y);

	 	 }

		ctx.stroke();

		window.requestAnimationFrame(draw);

	}

}
	// var sine = new SineWave(.184, 55.9, 28.9, 'test');

	//  window.requestAnimationFrame(sine.draw);


	//  var sine2 = new SineWave(.067, 59, 30, 'test2');

	//  window.requestAnimationFrame(sine2.draw);

	
	drawWave2(.6, 59, 30);

	drawWave1(.184, 56, 29);





})



