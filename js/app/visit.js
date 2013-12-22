App.Visit = Backbone.Model.extend({

	initialize: function() {
		this._shown = true;
	},

	getWhat: function() {
		var happening = this.get("happening");
		if (!happening) return;
		if (happening == "other") {
			return this._toSentenceCase(this.get("happening_other"));
		} else {
			return t("happening." + happening);
		}
	},

	getImpacts: function() {
		return this._getMultiOther("impacts", "impacts_other");
	},

	getLocation: function() {
		var location = this.get("myarea");
		var titleOrExtension = "";

		if (this.get("landtitle") == "yes") {
			titleOrExtension = "land title";
		} else if (this.get("customary") == "yes") {
			titleOrExtension = "extension area";
		}
		location = (location && location !== "other") ? "<em>" + t(location) + "</em> in " : "";
		location += "<em>" + t(this.get("myarea_village")) + "</em> " + titleOrExtension;
		return location;
	},

	getPlacename: function() {
		var placename = this.get("placename");
		return this._toSentenceCase(placename);
	},

	getWho: function() {
		return this._getMultiOther("people", "people_other");
	},

	getWhen: function() {
		return this.get("today");
	},

	getDate: function() {
		var d = this.get("today").split("-");
		return new Date(d[0], d[1]-1, d[2]);
	},

	getImgUrl: function() {
		return 'https://formhub.org/attachment/?media_file=' + this.get("_attachments")[0];
	},

	shown: function(show) {
		if (typeof show === "undefined") return this._shown;
		if (this._shown !== show) {
			this._shown = show;
			this.trigger('filtered', this);
		}
	},

	_getMultiOther: function(attr, attr_other) {
		var field = attr;
		attr = this.get(attr);
		attr_other = this.get(attr_other);
		var output = [],
			that = this;

		if (!attr) return;
		attr.split(" ").forEach(function(v, i) {
			if (v == "other") {
				output[i] = that._toSentenceCase(attr_other);
			} else {
				output[i] = t(field + "." + v);
			}
		});
		return output.join(", ");
	},

	_toSentenceCase: function(s) {
		s || (s = "");
		return s.replace(/(^[a-z])|(\.\s*[a-z])/g, function(s) { return s.toUpperCase(); });
	}
});