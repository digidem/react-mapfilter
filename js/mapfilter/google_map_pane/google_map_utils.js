// Miscellaneous utils to integrate Google Maps API

templateURL = function (str, data) {
    // evaluate url template to string, from Leaflet.Util
    return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
        var value = data[key];
        if (value === undefined) {
            throw new Error('No value provided for variable ' + str);
        } else if (typeof value === 'function') {
            value = value(data);
        }
        return value;
    });
};

// lookup map of 'happening' to colors
markerColors = {
    mining: 'rgb(166, 206, 227)',
    logging: 'rgb(31, 120, 180)',
    crossing: 'rgb(178, 223, 138)',
    rustling: 'rgb(51, 160, 44)',
    hunting: 'rgb(251, 154, 153)',
    fishing: 'rgb(227, 26, 28)',
    trapping: 'rgb(253, 191, 111)',
    tourism: 'rgb(255, 127, 0)',
    artefacts: 'rgb(202, 178, 214)',
    other: 'rgb(106, 61, 154)',
    grazing: 'rgb(247, 129, 191)',
};

/*
// Bing / MSVirtualEarth helpers, from mapsofall.com
getMsveDirection = function(x, y) {
  if (x == 1){
    if (y == 1){
      return '3';
    } else if (y == 0){
      return '1';
    }
  } else if (x == 0) {
    if (y == 1){
      return '2';
    } else if (y == 0){
      return '0';
    }
  }
  return '';
};

getMsveString = function(x, y, z) {
   var rx, x, ry, y;
   var s = '';
   for(var i = 17; i > z; i--){
      rx = x % 2;
      x = Math.floor(x / 2);
      ry = y % 2;
      y = Math.floor(y / 2);
      s = getMsveDirection(rx, ry) + s;
   }
   return s;
};

getMsveServer = function(x, y, z) {
   var rx, x, ry, y;
   var s = '';
   for(var i = 17; i > z; i--){
      rx = x % 2;
      x = Math.floor(x / 2);
      ry = y % 2;
      y = Math.floor(y / 2);
      s = getMsveDirection(rx, ry);
   }
   return s;
};
*/