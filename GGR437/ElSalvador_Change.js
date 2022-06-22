var elSalvador = ee.FeatureCollection("users/leilauy/elSalvador");

//-----------------------
// INPUTS
//-----------------------

// define collection parameters
var startYear = 1986;
var endYear = 2021;
var startDay = '06-01';
var endDay = '08-30';
var aoi = elSalvador;
var index = 'NDVI';
var maskThese = ['cloud', 'shadow', 'snow', 'water'];
var ftvList = ['NBR', 'NDVI'];

// define landtrendr parameters
var runParams = { 
  maxSegments:            5,
  spikeThreshold:         0.9,
  vertexCountOvershoot:   3,
  preventOneYearRecovery: true,
  recoveryThreshold:      0.25,
  pvalThreshold:          0.05,
  bestModelProportion:    0.75,
  minObservationsNeeded:  6
};

// define change parameters
var changeParams = {
  delta:  'loss',
  sort:   'greatest',
  year:   {checked:false, start:1986, end:2021},
  mag:    {checked:true, value:100,  operator:'>'},
  dur:    {checked:true, value:4,    operator:'<'},
  preval: {checked:true, value:200,  operator:'>'},
  mmu:    {checked:true, value:11},
};

//-----------------------
// BASIC FUNCTIONS
//-----------------------

var clipping = function(image) {
  return image.clip(aoi);
};

var unmasking = function(image) {
  return image.unmask(0);
};

var mean = function(image) {
  var mean = image.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: aoi,
    scale: 30,
    crs: 'EPSG:32616',
    bestEffort: true
  });
  return image.set(mean);
};

//-----------------------
// SCRIPT
//-----------------------

// load the LandTrendr.js module
var ltgee = require('users/emaprlab/public:Modules/LandTrendr.js'); 

// load area of Interest
var simplifyGeom = function(image) {
  return image.simplify({'maxError': 50});
};

aoi = aoi.map(simplifyGeom);
Map.addLayer(aoi);
Map.centerObject(aoi, 9);

// add index to changeParams object
changeParams.index = index;

// run landtrendr
var ltOutput = ltgee.runLT(startYear, endYear, startDay, endDay, aoi, index, ftvList, runParams, maskThese);
print(ltOutput, 'Land Trendr Output');

// clip to our area of interest
ltOutput = ltOutput.clip(aoi);

// Create Fitted Vegetation Time-Series
var fittedData = ltgee.getFittedData(ltOutput, startYear, endYear, index);
print(fittedData, 'Fitted Data per Year as Bands');

// Question 12: Create RGB for first, mid, and last year
Map.addLayer(fittedData, {"bands":["yr_1986","yr_2004","yr_2021"],"min":0,"max":900}, 'Fitted Vegetation Index Time-Series', true);

// Question 16: Export fitted Data for graph
var meanFittedData = fittedData.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: aoi,
  scale: 30,
  crs: 'EPSG:32616',
  bestEffort: true
});

print(meanFittedData);

Export.table.toDrive({
  collection: ee.FeatureCollection([ee.Feature(null, meanFittedData)]),
  description: 'fittedDataNDVI',
  fileFormat: 'CSV'
});

// Question 18: Year of Disturbance and Magnitude
var changeImg = ltgee.getChangeMap(ltOutput, changeParams);
print(changeImg, 'Change Map Output');

// set visualization dictionaries
var palette = ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000'];
var yodVizParms = {
  min: startYear,
  max: endYear,
  palette: palette
};

var magVizParms = {
  min: 200,
  max: 800,
  palette: palette
};

// magnitude of change
var mag = changeImg.select(['mag']);
print(mag, 'Magnitude of Change');
Map.addLayer(mag, magVizParms, 'Magnitude of Change', false);

// year of disturbance
var yod = changeImg.select(['yod']);
print(yod, 'Year of Detection');
Map.addLayer(yod, yodVizParms, 'Year of Detection', false);

// // exporting image
var mag = mag.clip(aoi).unmask(0).short();
Export.image.toDrive({
  image: mag, 
  description: 'magnitude', 
  region: aoi, 
  scale: 30, 
  crs: 'EPSG:5070', 
  maxPixels: 1e13
});

var yod = yod.clip(aoi).unmask(0).short();
Export.image.toDrive({
  image: yod, 
  description: 'year_of_detection', 
  region: aoi, 
  scale: 30, 
  crs: 'EPSG:5070', 
  maxPixels: 1e13
});

// Question 19: Percent of Pixel Count
var frequency = yod.select(['yod']).unmask(0).clip(aoi).reduceRegion({
  reducer: ee.Reducer.frequencyHistogram(),
  geometry: aoi,
  scale: 30,
  crs: 'EPSG:32616',
  tileScale: 7,
  maxPixels: 1e13
});

print(frequency, 'Frequency of the each year in disuturbance');

Export.table.toDrive({
  collection: ee.FeatureCollection([ee.Feature(null, frequency)]),
  description: 'frequencyPixelsYOD',
  fileFormat: 'CSV'
});


