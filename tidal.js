const express   = require('express');
const app       = express();
const http      = require('http');
const server    = http.createServer(app);
const path      = require('path');
const soap 		= require('soap');
const request 	= require('request');
const xml2js 	= require('xml2js');
const geoJSON 	= require('geojson');
const csv 		= require('csvtojson');
const fs 		= require('fs');
const mongo 	= require('mongodb');
const test 		= require('assert');
const ObjectId 	= require('mongodb').ObjectID;
const PDFDocument = require('pdfkit');
const geocoder = require('geocoder');


const mongoURL 	= 'mongodb://127.0.0.1:27017/tidal';
var db;
var stations;
var harmonics;

var WEBPORT     = 80;


if(process.argv.length > 2) parseCmdLine();


app.set('port', WEBPORT);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(WEBPORT, function listening() {
  
  console.log('Web server listening on port %d', server.address().port);

});


app.get('/coordsearch', function( req, res) {

  	console.log('coord endpoint hit');

	var lat = parseFloat(req.query.lat);
	var lon = parseFloat(req.query.lon);

	var arr = harmonics.find({

		"geometry" : {
	  		
	  		$near : { 

	  			$geometry : {
	  	
        			type : "Point" ,
        			coordinates : [ lon, lat ]

	        	},
	 		}

	 	}
	 }
	,{		
	}).limit(1).toArray();


	arr.then(function(station) {

		res.send(station);

	});

});


var findLatLon = function(req, res, next) {

	geocoder.geocode(req.query.search, function (err, response) {

		var arr = [];

		console.log(response);

		arr.push(response.results[0].geometry.location.lat);
		arr.push(response.results[0].geometry.location.lng);

		req.formatted_address = response.results[0].formatted_address;

		req.location = arr;

		next();

	})

}

var findInMongo = function(req, res, next) {

	console.log('find in mongo hit', req.location);

	var arr = harmonics.find({

			"geometry" : {
		  		
		  		$near : { 

		  			$geometry : {
		  	
	        			type : "Point" ,
	        			coordinates : [ req.location[1], req.location[0] ]

		        	},
		 		}

		 	}
		 }
		,{		
		}).limit(1).toArray();


		arr.then(function(station) {

			req.station = station;

			next();

		});

}

app.use(findLatLon);

app.use(findInMongo);


app.get('/namesearch', function(req, res) {

	console.log('name search endpoint hit');

	var response = req.station;

	response[0].metadata.search = req.query.search;
	response[0].metadata.location = req.location;
	response[0].metadata.formatted_address = req.formatted_address;

	console.log(response);

	res.send(response);

});



mongo.connect(mongoURL, function(err, database) {

	db = database;
	stations = db.collection('stations');
	harmonics = db.collection('harmonics');

	console.log('Connected to MongoDB');

});


function findNear(lat, lon, callback) {

	var lat = parseFloat(lat);
	var lon = parseFloat(lon);

	var arr = harmonics.find({

		"geometry" : {
	  		
	  		$near : { 

	  			$geometry : {
	  	
        			type : "Point" ,
        			coordinates : [ lon, lat ]

	        	},
	 		}

	 	}
	 }
	,{		
	}).limit(1).toArray();

	arr.then(function(station) {

		callback(station);

	});
}


function parseCmdLine() {

	var search = process.argv.slice(2).join(' ');

	console.log('search string', search);

	geocoder.geocode(search, function (err, res) {

		var lat = res.results[0].geometry.location.lat;
		var lon = res.results[0].geometry.location.lng;

		findNear(lat, lon);
	})
}


var createPDF = function(station) {

	var pdf = new PDFDocument({layout: 'portrait', size: [3168,2448]});

	pdf.pipe(fs.createWriteStream(station[0].properties.ID + '-graph.pdf'));

	var drawSine = function (amp, phase, freq) {

	var center = 1224;
	var oldX = 0;
	var oldY = 0;
	
	var newX = 0;
	var newY = 0;

		 for(var i = -1; i < 1; i += .0005) {

		 	var value = amp * Math.sin(2 * Math.PI * freq * i + phase);

		 	//newX = Math.abs(i) * 1000; 
		 	newX += 1;
		 	newY = center + (value * 1000);

		 	pdf.moveTo(oldX, oldY)
		 		.lineTo(newX, newY)
		 		.strokeColor('blue')
		 		.stroke();

		 	oldX = newX;
		 	oldY = newY;
		 }
	}


	for(var i = 0; i < 7; i++) {
	
		drawSine(station[0].metadata.constituents[i].amp, station[0].metadata.constituents[i].phase, station[0].metadata.constituents[i].speed);
	
	}

	pdf.end();

}


var parseHarmonicsToGEOJSON = function() {
  
	var arr = [];

	var oldId = 1611347;
	var newId;

	var newObj = {
		
		properties: {
			ID: null,
		},
		geometry: {
			type: null,
			coordinates: [],
		},
		metadata: {
			constituents: []
		}
	};
	
	var resetObj = function() {
			newObj = {
	
			properties: {
				ID: null,
			},
			geometry: {
				type: null,
				coordinates: [],
			},
			metadata: {
				constituents: []
			}
		};	
	}


	csv().fromFile('harmonics.csv').on('json', function(line) {

		newId = parseInt(line.station_id);


		var parseLine = function(line) {

			console.log(newId, oldId);

			if(newObj.properties.ID === null) {

				newObj.type = "Feature";
				newObj.properties.ID = line.station_id;
				newObj.geometry.type = "Point";
				newObj.geometry.coordinates = [  parseFloat(line["longitude (degree)"]), parseFloat(line["latitude (degree)"]) ];

			};

			if(newObj.metadata.constituents.length <= 36) {

				newObj.metadata.constituents.push({

					name: line.name,
					number: parseFloat(line.constituent_number),
					amp: parseFloat(line['amplitude (meters)']),
					phase: parseFloat(line['phase (degrees in GMT)']),
					speed: parseFloat(line['speed (degrees/hour)'])

				});

			} 

			oldId = newId;

		};


		var pushToArr = function() {

			arr.push(newObj);
			resetObj();
			
			oldId = null;

			console.log('pushed');

			parseLine(line);

		} 


		if(oldId === newId) {

			parseLine(line);

		} else pushToArr();


	}).on('done', function(err) {

		fs.writeFileSync('harmonics.json', JSON.stringify(arr, null, 2), 'utf8');  

		console.log('Harmonic convert and write to JSON done. Writing to Mongo...');


		harmonics.insertMany(arr).then(function(res) {

			console.log('Write to mongo done');

		 });
	 })
}


var loadStations = function() {

	fs.readFile('stations.geojson', 'utf8', function(err, data) {

		var arr = JSON.parse(data);

		for(var i = 0; i < arr.length; i++) {

			arr[i].geometry.coordinates[0] = parseFloat(arr[i].geometry.coordinates[0]);
			arr[i].geometry.coordinates[1] = parseFloat(arr[i].geometry.coordinates[1]);

		}

	});
}


var getHarmonics = function() {

	var obj = [];

	var harmonicsURL = 'https://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=harmonic_constituents&offering=urn:ioos:network:NOAA.NOS.CO-OPS:HarmonicConstituents&responseFormat=text/csv&timeZone=GMT&unit=Meters';

	// single location for testing: 'https://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=harmonic_constituents&offering=urn:ioos:station:NOAA.NOS.CO-OPS:8454000&responseFormat=text/csv&timeZone=GMT&unit=Meters';

	request(harmonicsURL, function(err, res, body) {

		fs.writeFile('harmonics.csv', body, function(err) {

			console.log('Harmonics received, written to harmonics.csv');

		});
	})
}


var getStations = function() {

	var stationsURL = 'https://opendap.co-ops.nos.noaa.gov/stations/stationsXML.jsp';

	var parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

	var parsedStations = [];

	request(stationsURL, function(err, res, body) {

		console.log('Got station info.');

		parser.parseString(body, function(err, response) {

			for(var i = 0; i < response.stations.station.length; i++) {

				var station = response.stations.station[i];

				var geo = geoJSON.parse( station, {Point: ['lat', 'long']});
			
				geo.geometry.type = "Point";
				geo.geometry.coordinates = [parseFloat(station.metadata.location.long), parseFloat(station.metadata.location.lat)];

				parsedStations.push(geo);

			}

			collection.insertMany(parsedStations).then(console.log('Stations added to db.'));

		})
	});
}

