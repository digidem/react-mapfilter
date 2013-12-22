App.DateFilterView = Backbone.View.extend({

    initialize: function() {
        this.template = _.template($("#template-filter-date").html());
    },

    render: function() {
        this.$el.append(this.template());
        return this;
    }
});