/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Boundary = ee.FeatureCollection("users/leilauy/DomRep_Boundary");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var LandsatLST = require('users/sofiaermida/landsat_smw_lst:modules/Landsat_LST.js');
var cmap1 = ['blue', 'cyan', 'green', 'yellow', 'red'];

var lst_image = LandsatLST.collection('L5', '1985-05-01', '1985-10-01', Boundary, true).sort('CLOUD_COVER_LAND').mosaic().clip(Boundary);
print(lst_image);
Map.addLayer(lst_image.select('LST'),{min:290, max:320, palette:cmap1}, 'LST');
