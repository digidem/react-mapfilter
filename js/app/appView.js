App.AppView = Backbone.View.extend({
    initialize: function() {
        window.app = this;
        
        this.collection.fetch();

        this.mapView = new App.MapView({ 
            el: $("#map"),
            collection: this.collection
        });

        this.filterView = new App.FilterView({
            id: "legend",
            tagName: "form",
            className: "form",
            collection: this.collection,
            filters: ["happening", "people"],
        });

        this.filterInfoView = new App.FilterInfoView({});

        this.popupView = new App.PopupView();

        this.$el.append(this.dateFilterGraph.render().el);
        this.$el.append(this.filterView.render().el);
        this.$el.append(this.popupView.$el.hide());
        this.mapView.$(".leaflet-control-container").prepend(this.filterInfoView.render().el);
    }
});