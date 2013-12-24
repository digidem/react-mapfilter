App.FilterInfoView = Backbone.View.extend({

    id: "filter-info",

    render: function() {
        this.$el.html("Showing <strong>all activities</strong> by <strong>all monitors</strong> on <strong>all dates</strong>");
        return this;
    },

    constructFilterText: function() {

    }
});