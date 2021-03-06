/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Boundary = ee.FeatureCollection("users/leilauy/DomRep_Boundary"),
    Landsat5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_TOA"),
    Landsat7 = ee.ImageCollection("LANDSAT/LE07/C01/T1_TOA"),
    Landsat8 = ee.ImageCollection("LANDSAT/LC08/C01/T1"),
    vizParams = {"bands":"NDVI","min":-1,"max":1};
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var LandsatLST = require('users/sofiaermida/landsat_smw_lst:modules/Landsat_LST.js');

//returns image iff the cloud cover is less than 20
var maskClouds = function(image) {
  var scored = ee.Algorithms.Landsat.simpleCloudScore(image);
  return image.updateMask(scored.select(['cloud']).lt(20));
};

//returns image with band NDVI
var addQualityBands = function(image) {
  return maskClouds(image)
  .addBands(image.normalizedDifference(['B5', 'B4']).rename('NDVI'))
};

//filters Landsat images for anything in that date and area
var collection = Landsat8.filterDate('2016-05-01', '2016-10-01').filterBounds(Boundary).map(addQualityBands);
print(collection)

//gets the greenest pixel of the entries and mosiacs it
var greenestPixelComposite = collection.qualityMosaic('NDVI').clip(Boundary);

//adds it to GEE map
Map.addLayer(greenestPixelComposite, vizParams, 'NDVI');

//Exports image
Export.image.toDrive({
  image: greenestPixelComposite.select('NDVI'),
  description: 'NDVI',
  scale: 30,
  region: Boundary,
  fileFormat: 'GeoTIFF',
  maxPixels: 118263277,
});

//LST
var NCEP_TPW = require('users/sofiaermida/landsat_smw_lst:modules/NCEP_TPW.js')
//cloud mask
var cloudmask = require('users/sofiaermida/landsat_smw_lst:modules/cloudmask.js')
//Normalized Difference Vegetation Index
var NDVI = require('users/sofiaermida/landsat_smw_lst:modules/compute_NDVI.js')

var cmap1 = ['blue', 'cyan', 'green', 'yellow', 'red'];

var LSTcollection = LandsatLST.collection('L8', '2016-05-01', '2016-10-01', Boundary, true).map(cloudmask.sr).map(NDVI.addBand('L8'));
print(LSTcollection);

//var greenestPixelCompositeLST = LSTcollection.qualityMosaic('NDVI').clip(Boundary);

Map.addLayer(LSTcollection.select('LST'), {min:290, max:320, palette:cmap1}, 'LST');
