$(document).ready(function() {

	console.log('ready');


	var sineArr = [];
	var canvasArr = [];

	var freqDiv = 2000,
		ampMulti = 1000,
		fps = 180,
		lineWidth = 1,
		psychFlag = true;

	var nav = $('#topNav');


	$('#freqSlider').on('input', function(event) {
	  
	 	var position = event.currentTarget.value;

		var minp = 0;
	  	var maxp = 100;

		var minv = Math.log(2);
		var maxv = Math.log(4000);

		var scale = (maxv-minv) / (maxp-minp);

	    setAllFreqDiv(Math.exp(minv + scale*(position-minp)));

	  });


	$('#ampSlider').on('input', function(event) {

		setAmpMulti(event.currentTarget.value);

	});

	$('#speedSlider').on('input', function(event) {

		setAllSpeed(event.currentTarget.value);

	});

	$('#openNav').on('click', function() {
		nav.css('height', '9%');
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

		getAndSetHarmonics(search);

	});


function getAndSetHarmonics(location) {

		$.ajax({

			url: 'http://127.0.0.1/namesearch',
			method: 'GET',
			data: {
				search: location
			}

		}).done(function(data) {

			removeAllCanvas();

			sineArr = [];

			for(var i = 0; i < 7; i++) {
			
				var amp = data[0].metadata.constituents[i].amp;
				var phase = data[0].metadata.constituents[i].phase;
				var freq = data[0].metadata.constituents[i].speed;

				sineArr.push( new createSineWave(amp, phase, freq) );
			
			}

			console.log(data);

			$('#searchString').val(data[0].metadata.search);

			setAmpMulti(ampMulti);

			setAllFreqDiv(freqDiv);

			setAllSpeed(fps);

			setAllLineWidth(lineWidth);

			setPsychFlag(psychFlag);

			drawSineArr();


		})
	};


	function createSineWave(amp, phase, freq) {

		this.width = $(window).width() + 20;

		this.amp = amp;
		this.ampMultiplier = 2000;		
		this.phase = phase;

		this.freqDivider = 3000;
		this.freq = freq;
		
		this.frames = 0;
		this.fps = 180;
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
	  
	   		that.phi = that.frames / that.fps;

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

 		this.setSpeed = function(num) {
 			that.fps = num;
 		}
	}


	drawSineArr = function() {

		sineArr.forEach(function(sine) {

			window.requestAnimationFrame(sine.draw)

		})
	}


	setAllFreqDiv = function(num) {

		freqDiv = num;

		sineArr.forEach(function(sine) {

			sine.setFreqDiv(freqDiv);

		})
	}

	setAllLineWidth = function(num) {

		lineWidth = num

		sineArr.forEach(function(sine) {

			sine.setLineWidth(lineWidth);

		})
	}

	setPsychFlag = function(bool) {

		psychFlag = bool;

		sineArr.forEach(function(sine) {

			sine.setPsychFlag(psychFlag);

		})
	}

	setAmpMulti = function(num) {

		ampMulti = num;

		sineArr.forEach(function(sine) {

			sine.setAmpMulti(ampMulti)
		
		})
	}

	setAllSpeed = function(num) {

		fps = num;

		sineArr.forEach(function(sine) {

			sine.setSpeed(fps);
		
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


	getAndSetHarmonics('Catalina Island, CA');


})
	





