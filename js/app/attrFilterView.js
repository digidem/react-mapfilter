App.AttrFilterView = Backbone.View.extend({
    initialize: function() {
        this.template = _.template($("#template-filter").html());
    },

    events: {
        "click .select_all": "selectAll",
        "click .select_none": "selectNone"
    },

    className: "filter",

    render: function() {
        var data = this.collection.getUnique(this.id);
        this.$el.append(this.template({
            title: t("filters." + this.id)
        }));
        data.forEach(function(item) {
            if (item === "") return;
            var view = new App.CheckboxView({
                attr: { value: item, text: t(this.id + "." + item), labelClass: (this.id === "happening") ? "label" : "" },
                collection: this.collection,
                className: "checkbox " + item
            });
            this.$el.append(view.render().el);
        }, this);

        return this;
    },

    selectNone: function() {
        this.$("input").prop("checked", false);
    },

    selectAll: function() {
        this.$("input").prop("checked", true);
    }
});