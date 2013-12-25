App.PopupView = Backbone.View.extend({

    id: "popup",

    events: {
        "click .close": "_close"
    },

    initialize: function() {
        this.filterView = app.filterView;
        this.template = _.template($("#template-popup").html());
    },

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
        this.filterView.$el.hide();
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

    _close: function() {
        this.sticky(false);
        if (this.iconView) this.iconView.$el.removeClass("hover clicked");
        this.hide();
    },

    hide: function() {
        if (this.sticky()) return;
        this.$el.hide();
        this.filterView.$el.show();
    }
});