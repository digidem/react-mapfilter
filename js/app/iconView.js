App.IconView = Backbone.View.extend({

    events: {
        "mouseover": "onMouseOver",
        "mouseout": "onMouseOut",
        "click": "onClick"
    },

	initialize: function(options) {
        this.appView = options.appView;
		var loc = this.model.get("_geolocation");

		if (!loc[0] || !loc[1]) loc = [0,0];

		this.marker = L.marker(loc, { icon: this.icon }).addTo(options.map);
        L.DomUtil.addClass(this.marker._icon, this.model.get("happening"));
        this.setElement(this.marker._icon);
		this.render();
        this.listenTo(this.model, "filtered", this.setOpacity);
	},

    icon: L.divIcon({
        html: '<svg><g transform="translate(4,4.5)">' +
            '<path class="outline" d="M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z"/>' +
            '<path class="fill" d="M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z"/>' +
            '</g></svg>' +
            '<div class="marker-text"/>',
          // detect and use retina markers, which are x2 resolution
          //((L.Browser.retina) ? '@2x' : '') + '.png',
        iconSize: [25, 34],
        iconAnchor: [25 / 2, 30],
        className: "marker"
    }),

	render: function() {
        var that = this;
        $(".marker-text", this.marker._icon).html("A");
		this.marker.update();
		// this.marker.bindPopup(this.template(this.model));
  //       this.marker.on('popupopen', function(e) {
  //           $("img", e.popup._contentNode).attr("src", that.model.getImgUrl());
  //       });
	},

    onMouseOver: function(e) {
        e.stopPropagation();
        this.$el.addClass("hover");
        this.appView.popupView.show({
            model: this.model
        });
    },

    onMouseOut: function() {
        this.$el.removeClass("hover");
        this.appView.popupView.hide();
    },

    onClick: function(e) {
        e.stopPropagation();
        this.$el.toggleClass("clicked");
        this.appView.popupView.toggle({
            model: this.model,
            sticky: true,
            iconView: this
        });
    },

    setOpacity: function(visit) {
        this.marker.setOpacity(visit.shown() ? 1 : 0);
        if (visit.shown()) {
            this.marker.setZIndexOffset(this._lastZIndex);
        } else {
            this._lastZIndex = this.marker.options.zIndexOffset;
            this.marker.setZIndexOffset(-99999);
        }
    },

	template: {}

});