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
