$(document).ready(function() {

	console.log('ready');

	var arrSine = [];


	function SineWave(amp, phase, freq) {

		this.width = $(window).width() + 50;
		this.height = $(window).height();

		this.amp = amp - 100;
		this.phase = phase;
		this.freq = freq;
		this.frames = 0;
		this.phi = 0
		this.x = 0;
		this.y = 0;
		this.lineWidth = 2;

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
	  
	   		that.phi = that.frames / 60;

			ctx.clearRect(0, 0, that.width, that.height);

			ctx.lineWidth = that.lineWidth;

		  	ctx.beginPath();

		  	ctx.strokeStyle = 'hsl(' + that.phi + '%,100%,20%)';
		  	
		  	ctx.moveTo(0, that.height);
		  
		  	for (that.x = 0; that.x < that.width; that.x++) {
		    	
		    	that.y = Math.sin(that.x * that.freq + that.phi) * that.amp / 2 + that.amp / 2;

		    	ctx.lineTo(that.x, that.y+that.lineWidth);

		 	 }

		 	// ctx.lineTo(that.width, that.height);
  		// 	ctx.lineTo(0, that.height);

		 	ctx.stroke();

		 	window.requestAnimationFrame(that.draw)
 		}

	}

var h = $(window).height();

	arrSine.push(new SineWave(h, 59, .01), new SineWave(h, 55, .0289 ));

	
	window.requestAnimationFrame(arrSine[0].draw)
	window.requestAnimationFrame(arrSine[1].draw)


})



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





