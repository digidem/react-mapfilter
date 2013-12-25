App.Visits = Backbone.Collection.extend({

	model: App.Visit,

	url: 'data/formhub.json',

    comparator: 'start',

    getUnique: function(attr) {
        var keys = this.map(function(d) { 
            if (!d.attributes[attr]) return "";
            return d.attributes[attr].split(" "); 
        });
        return _(keys).flatten().uniq().valueOf();
    }

});