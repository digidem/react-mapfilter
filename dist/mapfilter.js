// MapFilter.js 0.1.0
// ==================

//     (c) 2013-2014 Gregor MacLennan, Digital Democracy
//     MapFilter may be freely distributed under the MIT license.

// Initial Setup
// -------------
// 
// 
MapFilter = Backbone.View.extend({

    events: {
        "click": "closeGraphPane"
    },
    
    initialize: function(options) {
        window.app = this;

        // For this initial load of data do not trigger add events, but instead
        // trigger a custom event to refresh views and filters
        this.collection.fetch({
            silent: true, 
            success: function(collection, resp, options) {
                collection.trigger("firstfetch", collection, resp, options);
            }
        });

        this.mapPane = new MapFilter.MapPane({ 
            el: $('<div id="map"/>').appendTo(this.el),
            center: options.mapCenter,
            zoom: options.mapZoom,
            tileUrl: options.tileUrl,
            collection: this.collection
        });

        this.filterPane = new MapFilter.FilterPane({
            collection: this.collection,
            filters: options.filters
        });

        this.currentViewInfo = new MapFilter.CurrentViewInfo();

        this.infoPane = new MapFilter.InfoPane();

        this.listenTo(this.filterPane.graphPane, 'opened', this.openGraphPane);
        this.listenTo(this.filterPane.graphPane, 'closed', this.closeGraphPane);

        this.$el.append(this.filterPane.render().el);
        this.$el.append(this.infoPane.$el.hide());
        this.mapPane.$(".leaflet-control-container").prepend(this.currentViewInfo.render().el);
    },

    openGraphPane: function() {
        this.$el.addClass('show-date-filter');
    },

    closeGraphPane: function() {
        this.$el.removeClass('show-date-filter');
    }
});
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
// MapFilter.MapPane
// -----------------

// The MapFilter MapPane manages the map and markers on the map, hiding markers which
// do not match the current filter whenever the filter changes.
// 
// `options.center` is a [lat,lon] array of the starting center point for the map
// `options.zoom` is the initial zoom level for the map                                                                                                                                   this.markersById[model.cid]       =    new           MapFilter.MarkerView({ model: model, map:             this.map });     } [description]
// `options.tileUrl` is [URL template](http://leafletjs.com/reference.html#url-template) for map tile layer
MapFilter.MapPane = Backbone.View.extend({

    initialize: function(options) {
        // Initialize the [Leaflet](http://leafletjs.com/) map attaching to this view's element
        this.map = L.map(this.el, {
            center: options.center,
            zoom: options.zoom,
        });

        // Add the background tile layer to the map
        this.tiles = L.tileLayer(options.tileUrl).addTo(this.map);

        // Object to hold a reference to any markers added to the map
        this.markersById = {};

        // Crossfilter dimension based on model cid (Backbone's internal id
        // assigned to new models)
        this.dimension = this.collection.dimension(function(d) {
            return d.cid;
        });

        // This will group models by cid, which is unique, which means that
        // each group will have a count of 0 or 1 depending on whether
        // the model matches the filters set on the other crossfilter dimensions
        this.group = this.dimension.group();

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

    // `this.group.all()` is an array of every model in the collection by `cid`. 
    // The value will be 0 for filtered models, 1 for models that are unfiltered.
    // This loops through `this.group.all()` and calls `MapFilter.MarkerView.show()`
    filter: function() {
        this.group.all().forEach(function(d) {
            this.markersById[d.key].show(d.value);
        }, this);
    }
});
// MapFilter.MarkerView
// --------------------

// MapFilter MarkerView manages the markers displayed on the map. It should be 
// initialized with a reference to the model and to the map in the options hash
MapFilter.MarkerView = Backbone.View.extend({

    events: {
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut",
        "click": "onClick"
    },

    // The default icon is an svg icon wrapped in a div
    icon: L.divIcon({
        html: '<svg><g transform="translate(4,4.5)">' + 
              '<path class="outline" d="M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z"/>' + 
              '<path class="fill" d="M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z"/>' + 
              '</g></svg>' + 
              '<div class="marker-text"/>',
        iconSize: [25, 34],
        iconAnchor: [25 / 2, 30],
        className: "marker"
    }),

    initialize: function(options) {
        var loc = this.model.coordinates();

        // Sometimes models (monitoring reports) do not have coordinates
        if (!loc[0] || !loc[1]) loc = [0, 0];

        // Create a new marker with the default icon and add to the map
        this.marker = L.marker(loc, {
            icon: this.icon
        }).addTo(options.map);

        // Store a reference the icon div from this view's `el`
        this.setElement(this.marker._icon);

        // Add className from the model's "happening" field
        // **TODO** remove this dependency and color markers from array of colors
        this.$el.addClass(this.model.get("happening"));

        // Reference the marker's current z-index (we change the z-index later
        // when the markers are filtered, so unfiltered markers appear on top)
        this._lastZIndex = this.marker.options.zIndexOffset;
    },

    // TODO: remove/update this 
    render: function() {
        $(".marker-text", this.el).html("");
        this.marker.update();
    },

    // Removes this marker from the map 
    remove: function() {
        this.marker._map.removeLayer(this.marker);
    },

    // When the mouse is over the marker, show the info pane 
    onMouseOver: function(e) {
        e.stopPropagation();
        this.$el.addClass("hover");
        app.infoPane.show({
            model: this.model
        });
    },

    // Hide the infopane when the mouse leaves the marker 
    onMouseOut: function() {
        this.$el.removeClass("hover");
        app.infoPane.hide();
    },

    // When you click the marker, make the infoPane "stick" open
    // until you click on another marker 
    onClick: function(e) {
        e.stopPropagation();
        this.$el.toggleClass("clicked");
        app.infoPane.toggle({
            model: this.model,
            sticky: true,
            iconView: this
        });
    },

    // Shows or 'hides' a marker (hiding actually just reduces opacity
    // and send the marker behind shown markers)
    // `shown` is a boolean for whether the marker should be shown
    show: function(shown) {
        this.marker.setOpacity(shown ? 1 : 0.15);
        if (shown) {
            this.marker.setZIndexOffset(this._lastZIndex);
        } else {
            // Move 'hidden' markers behind the others
            this._lastZIndex = this.marker.options.zIndexOffset;
            this.marker.setZIndexOffset(-99999);
        }
    }
});
/**
 * Shows a readable description of the current filters in place
 * TODO: Finish this
 */
MapFilter.CurrentViewInfo = Backbone.View.extend({

    id: "filter-info",

    render: function() {
        this.$el.html("Showing <strong>all activities</strong> by <strong>all monitors</strong> on <strong>all dates</strong>");
        return this;
    },

    constructFilterText: function() {

    }
});
// MapFilter.InfoPane
// ------------------

// The InfoPane manages the display of the attributes and media associated
// with a point. It appears on mouseover/hover of a point, but if you click
// the point then it will "stick" open.
MapFilter.InfoPane = Backbone.View.extend({

    id: "info-pane",

    events: {
        "click .close": "close"
    },

    initialize: function() {
        this.template = _.template($("#template-info-pane").html());
    },

    // Populates the infopane contents with the data from the selected point
    render: function() {
        this.$el.html(this.template(this.model));
    },

    show: function(options) {
        if (this.sticky()) return;
        this.hide();
        this.model = options.model;
        this.iconView = options.iconView;
        this.render();
        this.sticky(options.sticky);
        this.$el.show();
    },

    toggle: function(options) {
        this.sticky(false);
        if (this.iconView === options.iconView) {
            this.hide();
            this.iconView = null;
        } else {
            if (this.iconView) this.iconView.$el.removeClass("clicked");
            this.show(options);
        }
    },

    sticky: function(sticky) {
        if (typeof sticky === "undefined") return this._sticky;
        if (sticky) {
            this.$el.addClass("sticky");
        } else {
            this.$el.removeClass("sticky");
        }
        this._sticky = sticky;
    },

    close: function() {
        this.sticky(false);
        if (this.iconView) this.iconView.$el.removeClass("hover clicked");
        this.hide();
    },

    hide: function() {
        if (this.sticky()) return;
        this.$el.hide();
    }
});
// MapFilter.FilterPane
// --------------------

// The FilterPane shows the list of filters that can be used to explore data.
// It creates a filter view for each filter in the array `options.filters`
// which should have the following properties:
// 
// - `field` is the field/attribute to filter by
// - `type` should be `discrete` for string data and `continuous` for numbers or dates
// - `expanded` sets whether the filter view is expanded or collapsed by default    
MapFilter.FilterPane = Backbone.View.extend({

    id: "filter-pane",

    initialize: function(options) {
        var filters = options.filters || [];

        // Initialize a graph pane to hold charts for continuous filters
        this.graphPane = new MapFilter.GraphPane({
            collection: this.collection
        });
        
        // Append the graph parent to this pane's parent
        this.$el.append(this.graphPane.render().el);

        this.$filters = $('<form class="form"/>').appendTo(this.el);

        // Loop through each filter and add a view to the pane
        filters.forEach(function(filter) {
            this.addFilter(filter);
        }, this);

    },

    // Add a filter on a field to the filter pane.
    addFilter: function(options) {
        var filterView;

        if (!options.field) {
            console.error(t("error.filter_missing"));
            return;
        }

        // Initialize a ContinuousFilterView or DiscreteFilterView
        // ContinousFilterView is linked to the GraphPane which will show
        // the bar chart for selecting ranges of data
        if (options.type === "continuous") {
            filterView = new MapFilter.ContinuousFilterView({
                collection: this.collection,
                field: options.field,
                expanded: options.expanded || false,
                graphPane: this.graphPane
            });
        } else {
            filterView = new MapFilter.DiscreteFilterView({
                collection: this.collection,
                field: options.field,
                expanded: options.expanded || false
            });
        }

        this.$filters.append(filterView.render().el);
    }
});
// MapFilter.DiscreteFilterView
// ----------------------------

// Creates a view to filter the collection by a discrete field
// (i.e. a string value or list of space-separated tags).
// Pass `options.field` with the name of the field/attribute to filter on.
MapFilter.DiscreteFilterView = Backbone.View.extend({

    events: {
        "click .select_all": "selectAll",
        "click .select_one": "selectOne",
        "click": "updateFilter"
    },

    className: "filter",

    initialize: function(options) {
        var field = this.field = options.field;
        this.$el.attr("id", field);

        // The template a partial are coded into the html
        this.template = _.template($("#template-discrete-filter").html());
        this.checkboxTemplate = _.template($("#template-checkbox").html());

        
        // `v` is the row in the dataset
        // `p` is `{}` for the first execution (passed from reduceInitial). 
        // For every subsequent execution it is the value returned from reduceAdd of the prev row
        function reduceAdd(p, v) {
            v.get(field).split(" ").forEach(function(val, idx) {
                p[val] = (p[val] || 0) + 1; //increment counts
            });
            return p;
        }

        function reduceRemove(p, v) {
            v.get(field).split(" ").forEach(function(val, idx) {
                p[val] -= 1;
            });
            return p;
        }

        // this is how our reduce function is seeded. similar to how inject or fold 
        // works in functional languages. this map will contain the final counts 
        // by the time we are done reducing our entire data set.
        function reduceInitial() {
            return {};  
        }

        // Create a dimension on the field for filtering
        this.dimension = this.collection.dimension(function(d) { return d.get(field); });

        // This reduces the collection down to an object with a key for each
        // unique value of the filter field, with the value as the count
        // of the number of models with that field.
        this.groupAll = this.dimension.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial);

        // When the collection first loads or models change, re-render the filter
        this.listenTo(this.collection, 'firstfetch change', this.render);

        this.render();
    },

    // Renders the template with a list of checkboxes for each value to filter on 
    render: function() {
        // If there is no data, noop
        if (!this.dimension.group().size()) return this;

        var checkboxes = [];

        // Create an array of checkboxes for each unique value of the filter field
        _.forEach(this.groupAll.value(), function(v, k) {
            checkboxes.push(this.checkboxTemplate({
                key: k, 
                text: t(this.field + "." + k), 
                labelClass: (this.field === "happening") ? "label" : "",
                className: "checkbox " + k
            }));
        }, this);

        // Render the filter's template
        this.$el.html(this.template({
            title: t("filters." + this.field),
            checkboxes: checkboxes
        }));

        return this;
    },

    // Select all items in this filter 
    selectAll: function() {
        this.$("input").prop("checked", true);
    },

    // Select a single value for this filter and unselect others
    selectOne: function(e) {
        this.$("input").prop("checked", false);
        $(e.target).parents(".checkbox").find("input").prop("checked", true);
    },

    // Update the filter on the collection whenever the selection changes 
    updateFilter: function() {
        var selected = [];

        // Create an array of selected values
        this.$("input:checked").each(function() {
            selected.push($(this).attr("value"));
        });

        // Set a filter to match values including lists of
        // space-separated tags
        this.dimension.filter(function(d) {
            return _.intersection(d.split(" "), selected).length ? true : false;
        });

        // Trigger an event on the collection so that other views can
        // update with the new filtered collection
        this.collection.trigger("filtered");
    }
});
// MapFilter.ContinuousFilterView
// ------------------------------

// The ContinuousFilterView is used for filtering via date or integer fields.
// **TODO** currently only supports date fields.
// It shows the currently selected range and the GraphPane which displays
// a barchart that allows a filter range to be selected.
MapFilter.ContinuousFilterView = Backbone.View.extend({

    events: {
        "click .select_range": "showGraphPane"
    },

    className: 'filter',

    // Pass the `options.field` to filter by, and a reference to the GraphPane
    // with `options.graphPane`
    initialize: function(options) {
        this.field = options.field;
        this.graphPane = options.graphPane;
        this.$el.attr("id", this.field);
        this.format = d3.time.format("%d %b %Y");

        this.template = _.template($("#template-continuous-filter").html());
        this.dimension = this.collection.dimension(function(d) { return new Date(d.attributes[options.field]); });
        this.group = this.dimension.group(d3.time.day);
        this.listenTo(this.collection, "filtered firstfetch", this.render);
    },

    // Simply renders the template and sets the view element html.
    render: function() {
        if (!this.dimension.top(1).length) return this;

        var startDate = this.format(this.dimension.bottom(1)[0].getDate()),
            endDate = this.format(this.dimension.top(1)[0].getDate());

        this.$el.html(this.template({
            filterRange: startDate + " &mdash; " + endDate
        }));
        return this;
    },

    showGraphPane: function(e) {
        e.stopPropagation();
        this.graphPane.open();
    }
});
MapFilter.GraphPane = Backbone.View.extend({

    id: "graph-pane",

    events: {
        "click .close": "close",
        "click": "noop"
    },

    initialize: function() {
        var self = this;
        this.$el.append('<button type="button" class="close" aria-hidden="true">&times;</button>');
        var date = this.collection.dimension(function(d) { return new Date(d.attributes.today); }),
            dates = date.group(d3.time.day);

        this.barChart = MapFilter.BarChart()
            .dimension(date)
            .group(dates)
            .round(d3.time.day.round)
          .x(d3.time.scale()
            .domain([new Date(2013, 9, 1), new Date(2013, 11, 20)])
            .rangeRound([0, 1400]))
            .on("brush", function() {
                self.collection.trigger("filtered");
            });
        this.listenTo(this.collection, "filtered", this.render);
    },

    render: function() {
        if (!this.collection.length) return this;
        d3.select(this.el).call(this.barChart);
        return this;
    },

    open: function() {
        this.trigger("opened");
        this.render();
    },

    close: function() {
        this.trigger("closed");
    },

    noop: function(e) {
        e.stopPropagation();
    }
});
MapFilter.BarChart = function() {
    if (!MapFilter.BarChart.id) MapFilter.BarChart.id = 0;

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
        x,
        y = d3.scale.linear().range([100, 0]),
        id = MapFilter.BarChart.id++,
        axis = d3.svg.axis().orient("bottom"),
        brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round;

    function chart(div) {
      var width = x.range()[1],
          height = y.range()[0];

      y.domain([0, group.top(1)[0].value]);

      div.each(function() {
        var div = d3.select(this),
            g = div.select("g");

        // Create the skeletal chart.
        if (g.empty()) {
          // div.select(".title").append("a")
          //     .attr("href", "javascript:reset(" + id + ")")
          //     .attr("class", "reset")
          //     .text("reset")
          //     .style("display", "none");

          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("clipPath")
              .attr("id", "clip-" + id)
            .append("rect")
              .attr("width", width)
              .attr("height", height);

          g.selectAll(".bar")
              .data(["background", "foreground"])
            .enter().append("path")
              .attr("class", function(d) { return d + " bar"; })
              .datum(group.all());

          g.selectAll(".foreground.bar")
              .attr("clip-path", "url(#clip-" + id + ")");

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axis);

          // Initialize the brush component with pretty resize handles.
          var gBrush = g.append("g").attr("class", "brush").call(brush);
          gBrush.selectAll("rect").attr("height", height);
          gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }

        // Only redraw the brush if set externally.
        if (brushDirty) {
          brushDirty = false;
          g.selectAll(".brush").call(brush);
          // div.select(".title a").style("display", brush.empty() ? "none" : null);
          if (brush.empty()) {
            g.selectAll("#clip-" + id + " rect")
                .attr("x", 0)
                .attr("width", width);
          } else {
            var extent = brush.extent();
            g.selectAll("#clip-" + id + " rect")
                .attr("x", x(extent[0]))
                .attr("width", x(extent[1]) - x(extent[0]));
          }
        }

        g.selectAll(".bar").attr("d", barPath);
      });

      function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", x(d.key), ",", height, "V", y(d.value), "h14V", height);
        }
        return path.join("");
      }

      function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    // brush.on("brushstart.chart", function() {
    //   var div = d3.select(this.parentNode.parentNode.parentNode);
    //   div.select(".title a").style("display", null);
    // });

    brush.on("brush.chart", function() {
      var g = d3.select(this.parentNode),
          extent = brush.extent();
      if (round) g.select(".brush")
          .call(brush.extent(extent = extent.map(round)))
        .selectAll(".resize")
          .style("display", null);
      g.select("#clip-" + id + " rect")
          .attr("x", x(extent[0]))
          .attr("width", x(extent[1]) - x(extent[0]));
      dimension.filterRange(extent);
    });

    brush.on("brushend.chart", function() {
      if (brush.empty()) {
        // var div = d3.select(this.parentNode.parentNode.parentNode);
        // div.select(".title a").style("display", "none");
        d3.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
        dimension.filterAll();
      }
    });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      axis.scale(x);
      brush.x(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (_) {
        brush.extent(_);
        dimension.filterRange(_);
      } else {
        brush.clear();
        dimension.filterAll();
      }
      brushDirty = true;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    return d3.rebind(chart, brush, "on");
};
