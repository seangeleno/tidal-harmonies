$(document).ready(function() {

	console.log('ready');


	var sineArr = [];
	var canvasArr = [];


	var nav = $('#topNav');


	$('#openNav').on('click', function() {
		nav.css('height', '8%');
		$('#openNav').css('display', 'none');
		$('#closeNav').css('display', 'initial');
		$('#searchForm').css('display', 'initial');

	});


	$('#closeNav').on('click', function() {
		nav.css('height', "0%");
		$('#openNav').css('display', 'initial');
		$('#closeNav').css('display', 'none');
		$('#searchForm').css('display', 'none');
	});


	$('#submitButton').on('click', function(event) {

		event.preventDefault();

		var search = $('#searchString').val().trim();

		$.ajax({

			url: 'http://127.0.0.1/namesearch',
			method: 'GET',
			data: {
				search: search
			}

	}).done(function(res) {

		removeAllCanvas();

		sineArr = [];

		for(var i = 0; i < 7; i++) {
		
			var amp = res[0].metadata.constituents[i].amp;
			var phase = res[0].metadata.constituents[i].phase;
			var freq = res[0].metadata.constituents[i].speed;

			sineArr.push( new CanvasSineWave(amp, phase, freq) );
		
		}

		console.log(sineArr);

		setAmpMulti(1800);

		setAllFreqDiv(500);

		setAllLineWidth(1);

		setPsychFlag(true);

		drawSineArr();

		})
	})


	function CanvasSineWave(amp, phase, freq) {

		this.width = $(window).width() + 20;

		this.amp = amp;
		this.ampMultiplier = 2000;		
		this.phase = phase;

		this.freqDivider = 3000;
		this.freq = freq;
		
		this.frames = 0;
		this.phi = 0
		this.x = 0;
		this.y = 0;

		this.psychFlag = true;

		this.lineWidth = 1;
		this.height = (this.amp * this.ampMultiplier) + this.lineWidth * 2;

		container = document.getElementById('canvas-container');

		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('class', 'sine');

		this.canvas.setAttribute('width', this.width);
		this.canvas.setAttribute('height', this.height);

		this.ctx = this.canvas.getContext("2d");

		container.appendChild(this.canvas);

		var that = this;

		this.draw = function() {

			var amp = that.amp * that.ampMultiplier;
			var freq = that.freq / that.freqDivider;

			that.frames += 1;
	  
	   		that.phi = that.frames / 120;

			that.ctx.clearRect(0, 0, that.width, that.height);

			that.ctx.lineWidth = that.lineWidth;

		  	that.ctx.beginPath();
	  	
		  	if(that.psychFlag) that.ctx.strokeStyle = 'hsl(' + that.y  + ',100%,50%)';
		  		else that.ctx.strokeStyle = 'rgb(255,255,255)';

		  	that.ctx.moveTo(0, that.height);
		  
		  	for (that.x = 0; that.x < that.width; that.x++) {
		    	
		    	that.y = Math.sin(that.x * freq + that.phi) * amp / 2 + amp / 2;

		    	that.ctx.lineTo(that.x, that.y+that.lineWidth);

		 	 }

		 	that.ctx.stroke();

		 	window.requestAnimationFrame(that.draw)
 		};

 		this.setFreqDiv = function(num) {
 			that.freqDivider = num;
 		};

 		this.setLineWidth = function(num) {
 			that.lineWidth = num;
 		};

 		this.setPsychFlag = function(bool) {

 			if(bool) {

				that.psychFlag = true;
			} else {

				that.psychFlag = false;

			}
 		};

 		this.setAmpMulti = function(num) {
 			that.ampMultiplier = num;
 			that.ampMultiplier = num;
			that.height = (that.amp * that.ampMultiplier) + that.lineWidth * 2;
			that.canvas.setAttribute('height', that.height);
 		};


	}


	drawSineArr = function() {

		sineArr.forEach(function(sine) {

			window.requestAnimationFrame(sine.draw)

		})
	}


	setAllFreqDiv = function(num) {

		sineArr.forEach(function(sine) {

			sine.setFreqDiv(num);

		})
	}

	setAllLineWidth = function(num) {

		sineArr.forEach(function(sine) {

			sine.setLineWidth(num);

		})

	}

	setPsychFlag = function(bool) {

		sineArr.forEach(function(sine) {

			sine.setPsychFlag(bool);

		})
	}

	setAmpMulti = function(num) {

		sineArr.forEach(function(sine) {

			sine.setAmpMulti(num)
		
		})

	}

	removeAllCanvas = function() {

		$('.sine').remove();

	}


	$(window).resize(function() {

		sineArr.forEach(function(sine) {

			sine.width = $(window).width() + 20;
			sine.canvas.setAttribute('width', sine.width);

		})
	})



})
	





	// $.ajax({

	// 	url: 'http://127.0.0.1/coordsearch',
	// 	method: 'GET',
	// 	data: {
			
	// 		lat: 20.9614, //hawaii
	// 		lon: -157.4121 

	// 		// lat: 34.0522,     //LA
	// 		// lon: -118.2437

	// 	}





