App.Visits = Backbone.Collection.extend({

	model: App.Visit,

	url: 'data/formhub.json',

    getUnique: function(attr) {
        var keys = this.map(function(d) { 
            if (!d.attributes[attr]) return "";
            return d.attributes[attr].split(" "); 
        });
        return _(keys).flatten().uniq().valueOf();
    }

});