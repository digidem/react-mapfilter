App.FilterView = Backbone.View.extend({
    initialize: function(options) {
        this.filters = options.filters || [];
        this.collection.on("sync", this.reset, this);
    },

    events: {
      "click"   : "toggle"
    },

    reset: function() {
        this.$el.html("");
        this.render();
    },

    render: function() {

        function renderDateFilterView() {
            return (new App.DateFilterView({
                collection: this.collection,
                id: "date"
            })).render().el;
        }

        function renderAttrFilterView(filter) {
            return (new App.AttrFilterView({ 
                collection: this.collection, 
                id: filter
            })).render().el;
        }

        this.$el.append(renderDateFilterView.call(this));

        this.filters.forEach(function(filter) {
            this.$el.append(renderAttrFilterView.call(this, filter));
        }, this);

        return this;
    },

    toggle: function(e) {
        var filters = {};
        var dateStart = this.$("#date-start").prop("valueAsDate") || 0;
        var dateEnd = this.$("#date-end").prop("valueAsDate") || 1e99;

        this.$(".filter").each(function() {
            var filter = filters[$(this).attr("id")] = [];
            $("input:checked", this).each(function() {
                filter.push($(this).attr("value"));
            });
        });

        this.collection.forEach(function(model) {
            var k, attr, show = true;
            for (k in filters) {
                attr = model.get(k) || "";
                if (_.intersection(filters[k], attr.split(" ")).length === 0) show = false;
            }
            var date = model.getDate();
            if (date < dateStart || date > dateEnd) show = false;
            model.shown(show);
        }, this);
    },

});