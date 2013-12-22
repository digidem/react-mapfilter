App.AppView = Backbone.View.extend({
    initialize: function() {

        this.collection.fetch();

        this.mapView = new App.MapView({ 
            el: $("#map"),
            collection: this.collection,
            appView: this
        });

        this.filterView = new App.FilterView({
            id: "legend",
            tagName: "form",
            className: "form",
            collection: this.collection,
            filters: ["happening", "people"],
        });

        this.popupView = new App.PopupView({ appView: this });

        this.$el.append(this.filterView.render().el);
        this.$el.append(this.popupView.$el.hide());
    }
});