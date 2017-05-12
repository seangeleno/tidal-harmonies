# tidal-harmonies

--- 7/11/17 changes ---

Sine wave animation of tidal harmonics is working. No graphics framework was used, just html canvas drawing and some math.

All sine waves are built with a single constructor. The real time updating is done with methods on the createSineWave constructor.

User can adjust amplitude (a multiplication factor), zoom in & out (a frequency divider), and speed with sliders in realtime without refresh. 

A new endpoint was created on the API that takes as a query a string (i.e. a placename). Locations are now searchable via a natural language search. User does not need to enter a lat & lon. String will resolve to a latitude and longitude on the server side and return a object containing the harmonic variables for that location. This was accomplished through express middleware that passes the response and request object through the geocoder api before it gets to the mongo query. 

--- 7/8/17 ---

Provides an endpoint at /harmonics that will take a latitude and longitude and return an object containing the closest known tidal harmonic constituents. More info about the harmonics of tides at [Theory of Tides](https://en.wikipedia.org/wiki/Theory_of_tides) 

Data comes from 2 NOAA sources, station information from [here](https://opendap.co-ops.nos.noaa.gov/stations/stationsXML.jsp) via XML and the harmonic data from [here](https://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=harmonic_constituents&offering=urn:ioos:network:NOAA.NOS.CO-OPS:HarmonicConstituents&responseFormat=text/csv&timeZone=GMT&unit=Meters) via a huge stream of CSV data. These sources were parsed and reorganized as GEOJSON and pushed into a MongoDB instance.     

This tool will allow us to search geographically for the nearest known set of raw data used to create a tidal prediction for a given area. This raw raw data will be used in future projects.

When run from the command line and passed an argument, the server will search by placename so you don't have to know the latitude and longitude. It will write a PDF file to the drive of the first 5 harmonic constituents for the given location, graphed as sin waves. 2 examples are included in this repo. The titles of the pdf files are the NOAA station IDs that produced the data used to create the graph.

A demo of the api in action is [here](http://www.rednightsky.com). The api is responding to a request for harmonic data about the Hawaiian Islands. The sine wave are being dynamically created from the returned harmonic constituents.

The api is simple;

	$.ajax({

		url: 'http:/www.rednightsky.com/harmonics',
		method: 'GET',
		data: {
			lat: 20.9614,
			lon: -157.4121 
		}
	
	}).done(function(res) {

		console.log(res);

		//do something with response

	}) 