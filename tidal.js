
const soap = require('soap');
const request = require('request');
const xml2js = require('xml2js');
const geoJSON = require('geojson');
const csv = require('csvtojson');
const fs = require('fs');
const mongo = require('mongodb');
const test = require('assert');
const ObjectId = require('mongodb').ObjectID;

const mongoURL = 'mongodb://127.0.0.1:27017/tidal';
var db;
var stations;
var harmonics;


mongo.connect(mongoURL, function(err, database) {

	db = database;
	stations = db.collection('stations');
	harmonics = db.collection('harmonics');

	console.log('Connected to MongoDB');

});


var parseHarmonicsToJSON = function() {
  
	var arr = [];

	var oldId = 8454000;
	var newId;

	var newObj = {
		stationId: null,
		location: null,
		constituents: []
	};

	csv().fromFile('harmonics.csv').on('json', function(obj) {

		newId = parseInt(obj.station_id);

		console.log(newId, oldId);

		var parseObj = function(obj) {
			if(newObj.stationId === null) {

				newObj.stationId = parseInt(obj.station_id),
				newObj.location = [ parseFloat(obj["latitude (degree)"]), parseFloat(obj["longitude (degree)"]) ];

			};

			if(parseInt(obj.constituent_number) > newObj.constituents.length) {

				newObj.constituents.push({

					name: obj.name,
					number: parseInt(obj.constituent_number),
					amp: parseFloat(obj['amplitude (meters)']),
					phase: parseFloat(obj['phase (degrees in GMT)']),
					speed: parseFloat(obj['speed (degrees/hour)'])

				});

			}

			oldId = newId;
		};

		var resetObj = function() {
			newObj = {
				stationId: null,
				location: null,
				constituents: []
			};		
		}


		if(newId === oldId) {

			parseObj(obj);

		} else {

			arr.push(newObj);
			resetObj();
			parseObj(obj);
				
			};
	}

	).on('done', function(err) {

		//console.log(JSON.stringify(arr, null, 2));

		fs.writeFileSync('harmonics.json', JSON.stringify(arr, null, 2), 'utf8');  

		console.log('Harmonic convert and write to JSON done. Writing to Mongo...');
	
		// harmonics.insertMany(arr).then(function(res) {

		// 	test.equal(arr.length, res.insertedCount, 'assertion error at mongo json insert');

		// 	console.log(res.insertedCount, ' docs inserted to db.');

		//  });
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

parseHarmonicsToJSON();
//downloadHarmonics();


