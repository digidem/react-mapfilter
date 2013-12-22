$(function() {

    var visits = new App.Visits();

	var appView = new App.AppView({ 
		el: $("#app"),
		collection: visits
	});
    
});
