$(document).ready(function() {

	console.log('ready');

	var arrSine = [];


	function CanvasSineWave(amp, phase, freq) {

		this.width = $(window).width() + 20;

		this.amp = amp * 5000;		
		this.phase = phase;

		this.freqDiv = 5000;

		this.freq = freq / this.freqDiv;
		
		this.frames = 0;
		this.phi = 0
		this.x = 0;
		this.y = 0;

		this.lineWidth = 1;
		this.height = this.amp + this.lineWidth*2;

		container = document.getElementById('canvas-container');

		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('class', 'sine');

		this.canvas.setAttribute('width', this.width);
		this.canvas.setAttribute('height', this.height);

		var ctx = this.canvas.getContext("2d");

		container.appendChild(this.canvas);

		var that = this;

		this.draw = function() {

			that.frames += .5;
	  
	   		that.phi = that.frames / 120;

			ctx.clearRect(0, 0, that.width, that.height);

			ctx.lineWidth = that.lineWidth;

		  	ctx.beginPath();

		  	ctx.strokeStyle = 'rgb(255,255,255)';
		  	
		  	ctx.moveTo(0, that.height);
		  
		  	for (that.x = 0; that.x < that.width; that.x++) {
		    	
		    	that.y = Math.sin(that.x * that.freq + that.phi) * that.amp / 2 + that.amp / 2;

		    	ctx.lineTo(that.x, that.y+that.lineWidth);

		 	 }

		 	ctx.stroke();

		 	window.requestAnimationFrame(that.draw)
 		}

 		this.setFreqDivider = function(num) {
 			that.freqDiv = num;
 			}

	}


	drawSineArr = function() {

		arrSine.forEach(function(sine) {

			window.requestAnimationFrame(sine.draw)

		})
	}


	setAllFreqDiv = function(num) {

		arrSine.forEach(function(sine) {

			sine.setFreqDivider(num);

		})
	}


	$.ajax({

		url: 'http://127.0.0.1/harmonics',
		method: 'GET',
		data: {
			lat: 20.9614,
			lon: -157.4121 
		}
	
	}).done(function(res) {

		for(var i = 0; i < 7; i++) {
		
			var amp = res[0].metadata.constituents[i].amp;
			var phase = res[0].metadata.constituents[i].phase;
			var freq = res[0].metadata.constituents[i].speed;


			arrSine.push( new CanvasSineWave(amp, phase, freq) );
		
		}

		console.log(res);
		console.log(arrSine);

		drawSineArr();

	})





})








