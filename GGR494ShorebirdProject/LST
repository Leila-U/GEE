/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var PointMatamoros = /* color: #ffc82d */ee.Geometry.Point([-97.48552080395797, 25.61345643440111]),
    PointCapeCod = /* color: #ffc82d */ee.Geometry.Point([-70.0067896535906, 41.77709858216962]),
    CapeCodBox = /* color: #00ffff */ee.Geometry.Polygon(
        [[[-68.9136500051531, 40.57396162837588],
          [-68.2215113332781, 42.481871446768245],
          [-70.7483668020281, 42.909820070748566],
          [-71.4020533254656, 41.13900295062152]]]),
    MatamorosBox = /* color: #bf04c2 */ee.Geometry.Polygon(
        [[[-98.27467535232037, 27.139048002187806],
          [-98.73610113357037, 25.241434542254932],
          [-96.72010992263287, 24.878182209079938],
          [-96.26417730544537, 26.801242422162748]]]);
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

var LandsatLST = require('users/sofiaermida/landsat_smw_lst:modules/Landsat_LST.js');
var Points = [PointCapeCod, PointMatamoros];
var cmap1 = ['blue', 'cyan', 'green', 'yellow', 'red'];

//  range[2018]
var satelliteL8 = 'L8';
var date_startL8 = '2018-05-01';
var date_endL8 = '2018-07-01';

// range[1992]
var satelliteL5 = 'L5';
var date_startL5 = '1992-05-01';
var date_endL5 = '1992-07-01';


for (var i = 0; i < Points.length; i++) {
  var L51988 = LandsatLST.collection(satelliteL5, date_startL5, date_endL5, Points[i], true).sort('CLOUD_COVER_LAND');
  var L82018 = LandsatLST.collection(satelliteL8, date_startL8, date_endL8, Points[i], true).sort('CLOUD_COVER_LAND');
  
  var exImageL5 = L51988.first();
  var exImageL8 = L82018.first();
  
  print(exImageL5);
  print(exImageL8);
  
  Map.addLayer(exImageL5.select('LST'),{min:290, max:320, palette:cmap1}, 'LST L5');
  Map.addLayer(exImageL8.select('LST'),{min:290, max:320, palette:cmap1}, 'LST L8');
  
  /*
  if (i === 0) {
    Export.image.toDrive({
      image: exImageL5.select('LST'),
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


