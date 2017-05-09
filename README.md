# tidal-harmonies

Provides an endpoint at /harmonics that will take a latitude and longitude and return an object containing the closest known tidal harmonic constituents. [Theory of Tides](https://en.wikipedia.org/wiki/Theory_of_tides) 

Data comes from 2 NOAA sources, station information from [here](https://opendap.co-ops.nos.noaa.gov/stations/stationsXML.jsp) via XML and the harmonic data from [here](https://opendap.co-ops.nos.noaa.gov/ioos-dif-sos/)SOS?service=SOS&request=GetObservation&version=1.0.0&observedProperty=harmonic_constituents&offering=urn:ioos:network:NOAA.NOS.CO-OPS:HarmonicConstituents&responseFormat=text/csv&timeZone=GMT&unit=Meters') via a huge stream of CSV data. These sources were parsed and reorganized as GEOJSON and pushed into a MongoDB instance.     

This allows us to search geographically for the nearest known set of raw data used to create a tidal prediction for that area. That raw data will be used in future projects.

When run from the command line, the node server will do a search by placename so you don't have to know the latitude and longitude. It will write a PDF file to the drive of the first 5 harmonic constituents for the given location, graphed as sin waves. 2 examples are included in this repo. The title of the file is the NOAA station ID that produced the data used to create the graph.