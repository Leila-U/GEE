/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imageCollectionL8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA"),
    imageCollectionL5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_TOA"),
    PointCapeCod = /* color: #00ff00 */ee.Geometry.Point([-69.99988317891913, 41.75118010918509]),
    PointMatamoros = /* color: #0000ff */ee.Geometry.Point([-97.25089421887093, 25.803360757126487]),
    vizParams_NDVIchange = {"min":-0.5,"max":0.5,"palette":["red","white","green"]},
    vizParams_FCC_L8 = {"bands":["B5","B4","B3"],"min":0,"max":0.5},
    vizParams_FCC_L5 = {"bands":["B4","B3","B2"],"min":0,"max":0.5};
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var GRAYMAP = [
  {
    stylers: [ { saturation: -100 } ]
  },
  { 
    elementType: 'labels',
    stylers: [ { visibility: 'off' } ]
  },
  { 
    featureType: 'road',
    elementType: 'geometry',
    stylers: [ { visibility: 'off' } ] 
  },
  { 
    featureType: 'road',
    elementType: 'labels',
    stylers: [ { visibility: 'off' } ]
  },
  {
    elementType: 'labels.icon',
    stylers: [ { visibility: 'off' } ]
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [ { visibility: 'off' }]
  }
];
Map.setOptions('Gray', {'Gray': GRAYMAP});
var vizParams_NDVI = {"min":0,"max":1,"palette":["red", "yellow", "green"]};

var Points = [PointCapeCod, PointMatamoros];

//  range[2018]
var satelliteL8 = 'L8';
var date_startL8 = '2018-05-01';
var date_endL8 = '2018-07-01';

// range[1992]
var satelliteL5 = 'L5';
var date_startL5 = '1992-05-01';
var date_endL5 = '1992-07-01';

var addNDVI_L8 = function(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
};

var addNDVI_L5 = function(image) {
  var ndvi = image.normalizedDifference(['B4', 'B3']).rename('NDVI');
  return image.addBands(ndvi);
};

for (var i = 0; i < Points.length; i++) {
  var L51988 = ee.ImageCollection(imageCollectionL5.filterDate(date_startL5, date_endL5).filterBounds(Points[i])).sort('CLOUD_COVER_LAND');
  var L82018 = ee.ImageCollection(imageCollectionL8.filterDate(date_startL8, date_endL8).filterBounds(Points[i])).sort('CLOUD_COVER_LAND');

  var exImageL5 = L51988.first();
  var exImageL8 = L82018.first();

  print(exImageL5);
  print(exImageL8);
  
  Map.addLayer(exImageL5, vizParams_FCC_L5, 'L5_FCC_' + i);
  Map.addLayer(exImageL8, vizParams_FCC_L8, 'L8_FCC_' + i);
  
  var withNDVI_L5 = addNDVI_L5(exImageL5);
  var withNDVI_L8 = addNDVI_L8(exImageL8);
  
  var NDVI_L5 = withNDVI_L5.select('NDVI');
  var NDVI_L8 = withNDVI_L8.select('NDVI');

  Map.addLayer(NDVI_L5, vizParams_NDVI, 'L5_NDVI_' + i);
  Map.addLayer(NDVI_L8, vizParams_NDVI, 'L8_NDVI_' + i);
  
  var NDVI_Change = NDVI_L8.subtract(NDVI_L5);
  Map.addLayer(NDVI_Change, vizParams_NDVIchange, 'NDVI_Changes_' + i);
  
  /*
  if (i === 0) {
    Export.image.toDrive({
      image: exIma.select('NDVI'),
      description: 'LST_L5_' + i,
      scale: 30,
      region: CapeCodBox,
      fileFormat: 'GeoTIFF',
    });
    Export.image.toDrive({
      image: exImageL8.select('LST'),
      description: 'LST_L8_' + i,
      scale: 30,
      region: CapeCodBox,
      fileFormat: 'GeoTIFF',
    });
    
  }
  
  else {
    Export.image.toDrive({
      image: exImageL5.select('LST'),
      description: 'LST_L5_' + i,
      scale: 30,
      region: MatamorosBox,
      fileFormat: 'GeoTIFF',
    });
    
    Export.image.toDrive({
      image: exImageL8.select('LST'),
      description: 'LST_L8_' + i,
      scale: 30,
      region: MatamorosBox,
      fileFormat: 'GeoTIFF',
    });
  }*/
}
