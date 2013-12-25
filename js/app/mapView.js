App.MapView = Backbone.View.extend({

	initialize: function() {
		this.map = L.map(this.el, {
			center: [2.6362, -59.4801],
			zoom: 10
		});
		L.tileLayer('http://localhost:20008/tile/wapichana_background/{z}/{x}/{y}.png').addTo(this.map);
		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'reset', this.addAll);
	},

	addOne: function(visit) {
      return new App.IconView({ model: visit, map: this.map });
    },

    addAll: function() {
      this.collection.each(this.addOne, this);
    },
});