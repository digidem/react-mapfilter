// MapFilter.MapPane
// -----------------

// The MapFilter MapPane manages the map and markers on the map, hiding markers which
// do not match the current filter whenever the filter changes.
// 
// `options.center` is a [lat,lon] array of the starting center point for the map
// `options.zoom` is the initial zoom level for the map
// `options.tileUrl` is [URL template](http://leafletjs.com/reference.html#url-template) for map tile layer
MapFilter.MapPane = Backbone.View.extend({

    initialize: function(options) {
        // Initialize the [Google Map](https://developers.google.com/maps/documentation/javascript/reference) map attaching to this view's element
        this.map = new google.maps.Map(this.el, {
            center: new google.maps.LatLng(options.center[0], options.center[1]),
            zoom: options.zoom,
            scrollwheel: options.scrollWheelZoom || true,
            streetViewControl: false,
            mapTypeControlOptions: {
              mapTypeIds: [ 'Bush & Mountains', google.maps.MapTypeId.SATELLITE/*, 'Bing Satellite'*/,
                            'Forest Watch' ]
          },
        });
        // google.maps.event.addDomListener(window, 'load', initialize);

        // Add the custom tile layer to the map
        this.map.mapTypes.set("Bush & Mountains", new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                tileurl = templateURL(options.tileUrl, {s: 'a', z: zoom, x: coord.x, y: coord.y});
                return tileurl;
            },
            tileSize: new google.maps.Size(256, 256),
            name: "Bush & Mountains",
            maxZoom: 18
        }));

        // Set default layer to custom imagery
        this.map.setMapTypeId('Bush & Mountains');

        // Create a layer with Bing satellite imagery
/*
        this.map.mapTypes.set("Bing Satellite", new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                var z = 17 - zoom;
                var s=getMsveString(coord.x,coord.y,z);
                var v=getMsveServer(coord.x,coord.y,z);
                return 'http://r'+v+'.ortho.tiles.virtualearth.net/tiles/h'+s+'.jpeg?g=80';
            },
            tileSize: new google.maps.Size(256, 256),
            name: "Satellite",
            maxZoom: 18
        }));
*/

        // Add GlobalForestWatch layer
        var gfw_overlay = new GFWOverlay();
        
        // this.map.getBounds() isn't available yet, cheat with predetermined extent
        var extent = new google.maps.LatLngBounds( new google.maps.LatLng(2.097645,-60.154386),
                                                  new google.maps.LatLng(3.174522,-58.805814));
        gfw_overlay.loadCartoDB(extent, this.map);
        this.map.mapTypes.set('Forest Watch', gfw_overlay);

        // Object to hold a reference to any markers added to the map
        this.markersById = {};

        // When a new model is created, add a new marker to the map
        this.listenTo(this.collection, 'add', this.addOne);

        // When the models are initially fetched, or the collection is reset
        // remove and re-add all the markers to the map
        this.listenTo(this.collection, 'firstfetch reset', this.addAll);

        // Remove a marker from the map when the model is removed from collection
        this.listenTo(this.collection, 'remove', this.removeOne);

        // Filter which markers are hidden or shown whenever the collection
        // is filtered
        this.listenTo(this.collection, 'filtered', this.filter);
    },

    // Create a new MarkerView for each model added to the collection,
    // and store a reference to that view in markersById 
    addOne: function(model) {
        this.markersById[model.cid] = new MapFilter.MarkerView({
            model: model,
            map: this.map
        });
    },

    // Remove all the markers from the map and add a marker for each model
    // in the collection 
    addAll: function() {
        this.removeAll();
        this.collection.each(this.addOne, this);
    },

    // Remove a single marker for a given model from the map 
    removeOne: function(model) {
        this.markersById[model.cid].remove();
        // Remove reference to marker to allow garbage collection;
        delete this.markersById[model.cid];
    },

    // Remove all markers from the map 
    removeAll: function() {
        _.each(this.markersById, function(v) {
            this.removeOne(v.model);
        }, this);
    },

    // `this.collection.groupByCid.all()` is an array of every model in the collection by `cid`. 
    // The value will be 0 for filtered models, 1 for models that are unfiltered.
    // This loops through `this.group.all()` and calls `MapFilter.MarkerView.show()`
    filter: function() {
        var i = 0;
        this.collection.groupByCid.all().forEach(function(d) {
            this.markersById[d.key].show(d.value, i);
            i += d.value;
        }, this);
    }
});
