App.CheckboxView = Backbone.View.extend({

    initialize: function(options) {
        this.attr = options.attr;
        this.template = this.template || _.template($("#template-checkbox").html());
    },

    render: function() {
        this.$el.append(this.template(this.attr));
        return this;
    },

    template: null
});