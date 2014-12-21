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
        // A global reference to the container view (MapFilter)
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
            id: 'map',
            center: options.mapCenter,
            zoom: options.mapZoom,
            tileUrl: options.tileUrl,
            bingKey: options.bingKey,
            collection: this.collection
        });

        this.printPane = new MapFilter.PrintPane({
            id: 'print-pane',
            center: options.mapCenter,
            zoom: options.mapZoom,
            tileUrl: options.tileUrl,
            bingKey: options.bingKey,
            collection: this.collection,
            scrollWheelZoom: false
        });

        this.filterPane = new MapFilter.FilterPane({
            id: 'filter-pane',
            collection: this.collection,
            filters: options.filters
        });

        this.currentViewInfo = new MapFilter.CurrentViewInfo({
             id: 'filter-info'
        });

        this.infoPane = new MapFilter.InfoPane({
            id: 'info-pane'
        });

        this.listenTo(this.filterPane.graphPane, 'opened', this.openGraphPane);
        this.listenTo(this.filterPane.graphPane, 'closed', this.closeGraphPane);

        this.$el.append(this.mapPane.el);
        this.$el.append(this.printPane.el);
        this.$el.append(this.filterPane.render().el);
        this.$el.append(this.infoPane.$el.hide());
        // this.mapPane.$(".leaflet-control-container").prepend(this.currentViewInfo.render().el);

        // When the Leaflet Map is first initialized, it is not attached to the DOM
        // and does not have a width. We need to reset the size here now it is attached.
        // this.printPane.mapPane.map.invalidateSize();
        // this.mapPane.map.invalidateSize();
    },

    openGraphPane: function() {
        this.$el.addClass('show-date-filter');
    },

    closeGraphPane: function() {
        this.$el.removeClass('show-date-filter');
    }
});
