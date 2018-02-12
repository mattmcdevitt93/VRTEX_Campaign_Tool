'use strict';
var module = module || {};
var firebase = firebase || {};
var config = config || {};

function testData(data) {
	firebase.database().ref().set({
		test: data
	});
}

$(document).ready(function() {
	console.log('Ready!');
	module.bindings();
	firebase.initializeApp(config);
	testData(1);
});

module.bindings = function() {
	$('#newEventButton').click(function(){
		$.ajax({url: 'https://esi.tech.ccp.is/latest/sovereignty/campaigns/?datasource=tranquility', success: function(result){
			// console.log('Ajax');
			// console.log(result);
			module.drawCampaignList(result);
		}});
	});

};

module.drawCampaignList = function(data) {
	for (var i = data.length - 1; i >= 0; i--) {
		console.log(data[i]);
		var d1 = $.ajax({url: 'https://esi.tech.ccp.is/latest/universe/systems/' + data[i].solar_system_id + '/?datasource=tranquility&language=en-us', success: function(result){
			// console.log(result);
		}});
		var d2 = $.ajax({url: '		https://esi.tech.ccp.is/latest/alliances/' + data[i].defender_id + '/?datasource=tranquility', success: function(result){
			// console.log(result);
		}});

		var d3 = data[i];


		$.when(i, d1, d2, d3 ).done(function (index, v1, v2, v3 ) {
			$('.loader').addClass('hidden');
			console.log("=====================");
			console.log("index: " + index ); // v1 is system data
		    console.log("System data: "); // v1 is system data
		    console.log(v1 ); // v1 is system data
		    console.log("Alliance data: "); // v2 is alliance data
		    console.log(v2); // v2 is alliance data
		    console.log("Passed Data: "); // v3 is passed in data
		    console.log(v3); // v3 is passed in data
		    debugger
		    $("<div id='event_" + index + "' class='card'> <div class='card-divider'> <span>System Name: " + v1[0].name + " | Target Structure: WIP</span> </div> <div class='card-section'> <span>Structure Owner: TICKER</span> <div class='button-group float-right'> <a class='button'>Hide</a> <a class='button'>Map</a> <a class='button success'>Start</a> </div> </div> </div>").appendTo( "#CreateModalData" );

});


}
};

module.addHidden = function(id) {
	$('#'+id).addClass('hidden');
};



