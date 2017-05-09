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

var arrSine = [];


	function SineWave(amp, phase, freq, colorS) {

		this.width = $(window).width();
		this.height = $(window).height();

		this.amp = amp;
		this.phase = phase;
		this.freq = freq;
		//this.id = id;
		this.frames = 0;
		this.phi = 0
		this.x = 0;
		this.y = 0;
		this.lineWidth = 15;
		this.colorS = colorS;

		container = document.getElementById('canvas-container');

		this.canvas = document.createElement('canvas');
		//this.canvas.setAttribute('id', this.id);

		this.canvas.setAttribute('width', this.width);
		this.canvas.setAttribute('height', this.height);

		let ctx = this.canvas.getContext("2d");

		container.appendChild(this.canvas);

		var that = this;

		this.draw = function() {

			//console.log(that);

			that.frames += .5;
	  
	   		that.phi = that.frames / 30;

			ctx.clearRect(0, 0, that.width, that.height);

			ctx.lineWidth = that.lineWidth;

		  	ctx.beginPath();

		  	ctx.strokeStyle = 'rgb(' + that.frames + that.colorS + ',100,100)';
		  	
		  	ctx.moveTo(0, that.height);
		  
		  	for (that.x = 0; that.x < that.width; that.x++) {
		    	
		    	that.y = Math.sin(that.x * that.freq + that.phi) * that.amp / 2 + that.amp / 2;

		    	ctx.lineTo(that.x, that.y);

		 	 }

		 	 ctx.stroke();

		 	 window.requestAnimationFrame(that.draw)
 		}

	}

var h = $(window).height();

	arrSine.push(new SineWave(h, 59, .01, 120), new SineWave(h, 55, .0289, 1) );

	
	window.requestAnimationFrame(arrSine[0].draw)
	window.requestAnimationFrame(arrSine[1].draw)


	//console.log(arrSine);

	
// setInterval(function() {

// 	// 	for(var i = 0; i < arrSine.length; i++) {

// 	// 		//console.log(arrSine[i]);

// 	// 		arrSine[i].draw();

// 	// 	}

// 	// }, 100 );

	// 
	 //window.requestAnimationFrame(sine2.draw);

	// var sine = new SineWave(.184, 55, .289, 'test');

	// sine.draw()


	//  window.requestAnimationFrame(sine.draw);





// function drawWave1(amp, phase, freq) {

// 	var width = $(window).width();
// 	var height = $(window).height();

// 	var amp = amp * 1000;
// 	var phase = phase;
// 	var freq = freq;
// 	var frames = 0;
// 	var phi = 0
// 	var x = 0;
// 	var y = 0;
// 	var lineWidth = 1;

// 	var canvas = document.getElementById('canvas1');

// 	canvas.setAttribute('width',width);
// 	canvas.setAttribute('height',height);

// 	var ctx = canvas.getContext("2d");

// 	this.draw = function() {

// 		frames += 1;
	  
// 	   	phi = frames / 60;

// 		ctx.clearRect(0, 0, width, height);

// 		ctx.lineWidth =lineWidth;

// 		ctx.beginPath();

// 		ctx.strokeStyle = 'rgb(255,0,0)';
		
// 		ctx.moveTo(0, height);
		  
// 	  	for (x = 0; x < width; x++) {

// 	    	y = (Math.sin(x * freq + phi) * amp / 2 + amp / 2) + (height / 6);

// 	    	ctx.lineTo(x, y);

// 	 	 }

// 		ctx.stroke();

// 		//window.requestAnimationFrame(draw);

// 	}

// 	this.draw();

// }



// function drawWave2(amp, phase, freq) {

// 	var width = $(window).width();
// 	var height = $(window).height();

// 	var amp = amp * 1000;
// 	var phase = phase;
// 	var freq = freq;
// 	var frames = 0;
// 	var phi = 0
// 	var x = 0;
// 	var y = 0;
// 	var lineWidth = 1;

// 	var canvas = document.getElementById('canvas2');

// 	canvas.setAttribute('width',width);
// 	canvas.setAttribute('height',height);

// 	var ctx = canvas.getContext("2d");

// 	this.draw = function() {

// 		frames += 1;
	  
// 	   	phi = frames / 60;

// 		ctx.clearRect(0, 0, width, height);

// 		ctx.lineWidth = lineWidth;

// 		ctx.beginPath();

// 		ctx.strokeStyle = 'rgb(0,0,255)';
		
// 		ctx.moveTo(0, height);
		  
// 	  	for (x = 0; x < width; x++) {
	    	
// 	    	y = (Math.sin(x * freq + phi) * amp / 2 + amp / 2) + (height / 6);

// 	    	ctx.lineTo(x, y);

// 	 	 }

// 		ctx.stroke();

// 		//window.requestAnimationFrame(draw);

// 	};

// 	this.draw();

// }



	// drawWave2(.6, 59, .030);

	// drawWave1(.184, 56, .029);



	// function drawAll() {

	// 	new drawWave2().draw();
	// 	new drawWave1().draw();
	// }

// setInterval(drawAll, 10);



})



