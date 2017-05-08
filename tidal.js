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


const mongoURL 	= 'mongodb://127.0.0.1:27017/tidal';
var db;
var stations;
var harmonics;

var WEBPORT     = 80;


app.set('port', WEBPORT);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(WEBPORT, function listening() {
  
  console.log('Web server listening on port %d', server.address().port);

});


app.get('/harmonics', function( req, res) {

  	console.log('hit harmonics endpoint');

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

		console.log(station);
		res.send(station);


	});

});

// app.get('/', function(req, res) {

//   	console.log('hit harmonics endpoint');

//   	var id = parseInt(req.query.id);

// 	console.log(id);


//   	var arr = harmonics.find({

//   		"stationId" : id

//   	},
//   	{
//   	}).toArray();




//   	arr.then(function(docs) {

//   		console.log(docs);

//   		res.send(docs);

//   	})


// })

mongo.connect(mongoURL, function(err, database) {

	db = database;
	stations = db.collection('stations');
	harmonics = db.collection('harmonics');

	console.log('Connected to MongoDB');

});


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

		//console.log(JSON.stringify(arr, null, 2));

		fs.writeFileSync('harmonics.json', JSON.stringify(arr, null, 2), 'utf8');  

		console.log('Harmonic convert and write to JSON done. Writing to Mongo...');
	
		//arr.pop();

		harmonics.insertMany(arr).then(function(res) {

			//test.equal(arr.length, res.insertedCount, 'assertion error at mongo json insert');

			//console.log(res.insertedCount, ' docs inserted to db.');

			console.log('done');

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

		fs.writeFile('single.csv', body, function(err) {

			console.log('done.');

		});
	})
}


var getStations = function() {

	var stationsURL = 'https://opendap.co-ops.nos.noaa.gov/stations/stationsXML.jsp';

	var parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

	var parsedStations = [];

	request(stationsURL, function(err, res, body) {

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

