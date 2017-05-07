  var soap = require('soap');
  
  var url = 'https://opendap.co-ops.nos.noaa.gov/axis/services/HarmonicConstituents?wsdl';
  // var args = {
  // 	name: 'value'
  // };
  
  soap.createClient(url, function(err, client) {

  	if(err) console.log('error:', err);

   	console.log('soap ok');

   	var services = client.describe();

   	console.log(JSON.stringify(services, null, 2));

  });