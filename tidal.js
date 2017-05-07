const soap = require('soap');
const request = require('request');
const xml2js = require('xml2js');

var url = 'https://opendap.co-ops.nos.noaa.gov/axis/services/HarmonicConstituents?wsdl';
var stations = 'https://opendap.co-ops.nos.noaa.gov/stations/stationsXML.jsp';


var parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});



  // soap.createClient(url, function(err, client) {

  // 	if(err) console.log('error:', err);

  //  	console.log('soap ok');

  //  	var services = client.describe();

  //  	console.log(JSON.stringify(services, null, 2));

  // });


request(stations, function(err, res, body) {


	parser.parseString(body, function(err, response) {

		//console.log(JSON.stringify(response, null, 2));

		console.log( JSON.stringify( response.stations.station[0], null, 2 ) );


	})


});
