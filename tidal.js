const soap = require('soap');
const request = require('request');
const xml2js = require('xml2js');
const geoJSON = require('geojson');
const csv=require('csvtojson');
const fs = require('fs');
const mongo = require('mongodb');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var mongoURL = 'mongodb://127.0.0.1:27017/tidal';
var db;
var collection;

mongo.connect(mongoURL, function(err, database) {

	db = database;
	collection = db.collection('stations');

});

var getHarmonics = function() {
  
	var url = 'https://opendap.co-ops.nos.noaa.gov/axis/services/HarmonicConstituents?wsdl';

 	soap.createClient(url, function(err, client) {

	  	if(err) console.log('error on SOAP:', err);

	   	console.log('soap ok...');

	   	//var services = client.describe();

	   	//console.log(JSON.stringify(services, null, 2));

	   	client.getHConstituentsAndMetadata({stationId: '8454000', unit: 0, timeZone: 0}, function(err, res) {

	   		console.log(err);

	   		console.log(JSON.stringify(res, null, 2));


	   	});


	});

}


var loadStations = function() {

	fs.readFile('stations.geojson', 'utf8', function(err, data) {

		var arr = JSON.parse(data);

		for(var i = 0; i < arr.length; i++) {

			arr[i].geometry.coordinates[0] = parseFloat(arr[i].geometry.coordinates[0]);
			arr[i].geometry.coordinates[1] = parseFloat(arr[i].geometry.coordinates[1]);

		}


		console.log( arr.length );

	});
}

var downloadHarmonics = function() {

	var harmonicsURL = 'https://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=harmonic_constituents&offering=urn:ioos:network:NOAA.NOS.CO-OPS:HarmonicConstituents&responseFormat=text/csv&timeZone=GMT&unit=Meters'

	//'https://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=harmonic_constituents&offering=urn:ioos:station:NOAA.NOS.CO-OPS:8454000&responseFormat=text/csv&timeZone=GMT&unit=Feet';

	//'https://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=harmonic_constituents&offering=urn:ioos:station:NOAA.NOS.CO-OPS:8454000&responseFormat=text/xml;subtype=%22om/1.0.0/profiles/ioos_sos/1.0%22&timeZone=GMT&unit=Feet';
	
	//'https://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=harmonic_constituents&offering=urn:ioos:network:NOAA.NOS.CO-OPS:HarmonicConstituents&featureOfInterest=BBOX:-177.3600,-18.1333,178.4250,71.3601&responseFormat=text/xml;subtype="om/1.0.0/profiles/ioos_sos/1.0"&timeZone=GMT&unit=Feet';

//	var parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});

	var parsedHarmonics = [];

	
	request(harmonicsURL, function(err, res, body) {

		//xml2js.parseString(body, function(err, response) {

		//console.log(JSON.stringify(body, null, 2));

		//})


		csv().fromString(body).on('json', (jsonObj) => {

			console.log(jsonObj);

		})


	})


}


var downloadStations = function() {

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

downloadHarmonics();
