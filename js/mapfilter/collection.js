// MapFilter.Collection
// --------------------

// This collection of models (data records) extends  
// [crossfilter()](http://square.github.io/crossfilter/) 
// to allow fast filtering by different filters / dimensions
MapFilter.Collection = Backbone.Collection.extend({

    initialize: function(models, options) {
        // Pass the url endpoint for this collection in the options hash
        if (options.url) this.url = options.url;
        // Initialize a new [crossfilter](http://square.github.io/crossfilter/) instance
        this.crossfilter = crossfilter();
        // Stores a reference to each dimension created on the crossfilter
        this.dimensions = [];
        this.resetFilter();
        this.on("change remove reset", this.resetFilter);
        this.on("add firstfetch", this.addToFilter);
    },

    // A wrapper for `crossfilter().dimension` which stores a reference
    // to the dimension which allows for the crossfilter to be reset later 
    dimension: function(value) {
        var dimension = this.crossfilter.dimension(value);
        this.dimensions.push(dimension);
        return dimension;
    },

    // Clears the filters on all the dimensions and removes all records
    // and re-adds them (`crossfilter().remove` only removes unfiltered records) 
    resetFilter: function() {
        this.dimensions.forEach(function(dimension) {
            dimension.filterAll();
        });
        this.crossfilter.remove();
        this.addToFilter(this.models);
        return this;
    },

    // Adds either a single model or a collection of models to the crossfilter 
    addToFilter: function(records) {
        if (records instanceof Backbone.Collection)
            records = records.models;
        return this.crossfilter.add(records);
    }
});
