// helper functions for GFW formatting
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based         
  var dd  = this.getDate().toString();
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
 };

google.maps.LatLng.prototype.toGeoArray = function() {
  return [this.lng(), this.lat()]; // coords in x,y
};

// Google Maps Overlay for GlobalForestWatch FORMA data, hosted on CartoDB
function GFWOverlay(options) {
  var defaults = {
    api: "http://wri-01.cartodb.com/api/v2/sql",
    select: "f.*",
    from: "forma_api f",
    begin: "2006-01-01", // first date available
    end:  (new Date()).yyyymmdd(), // today yyyy-mm-dd
    where: "ST_INTERSECTS(ST_SetSRID(ST_GeomFromGeoJSON('{geom}'), 4326), f.the_geom)",
    format: "&version=v2&format=geojson"
  };
  this.options = $.extend(defaults, options);
}
GFWOverlay.prototype = new google.maps.StyledMapType();
GFWOverlay.prototype.loadCartoDB = function(bounds, map) {
  // construct full bounding box from corners
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  var nw = new google.maps.LatLng(ne.lat(), sw.lng());
  var se = new google.maps.LatLng(sw.lat(), ne.lng());
  // create geom
  var bb_geom = { type: "Polygon",
      coordinates: [[nw.toGeoArray(), ne.toGeoArray(), se.toGeoArray(), sw.toGeoArray()]] // double nested
  };

  // construct query SQL
  var query = "SELECT " + this.options.select +
        " FROM " + this.options.from +
        " WHERE f.date >= '" + this.options.begin + "'::date" +
        " AND f.date <= '" + this.options.end + "'::date" +
        " AND " + this.options.where.replace('{geom}', JSON.stringify(bb_geom));
  var query_string = '?q=' + encodeURIComponent(query).replace(/%20/g, "+"); //weird encoding required by CartoDB
  var url = this.options.api + query_string + this.options.format;
  
  var promise = $.getJSON(url);
  promise.then(function(data){
    map.data.addGeoJson(data,{idPropertyName: "cartodb_id"}); // call the underlying gmaps function
  });
    
};
GFWOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
};

// Set the visibility to 'hidden' or 'visible'.
GFWOverlay.prototype.hide = function() {
  if (this.div_) {
    // The visibility property must be a string enclosed in quotes.
    this.div_.style.visibility = 'hidden';
  }
};

GFWOverlay.prototype.show = function() {
  if (this.div_) {
    this.div_.style.visibility = 'visible';
  }
};

GFWOverlay.prototype.toggle = function() {
  if (this.div_) {
    if (this.div_.style.visibility == 'hidden') {
      this.show();
    } else {
      this.hide();
    }
  }
};