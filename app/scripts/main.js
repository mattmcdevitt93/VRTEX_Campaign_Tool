'use strict';
// ================================================
// Function Prototypes and placeholders
// ================================================
var module = module || {};
var firebase = firebase || {};
var config = config || {};

function testData(data) {
	firebase.database().ref().set({
		test: data
	});
}

// ================================================
// Document Ready
// ================================================

$(document).ready(function() {
	console.log('Ready!');
	firebase.initializeApp(config);
	module.bindings();
	// $(document).foundation();
	testData(1);
});

// ================================================
// Event Listeners and Binding Functions
// ================================================

module.bindings = function() {
		// Pulls ESI campaign list when the modal is opened, not when the page loads
		$('#newEventButton').click(function(){
			console.log('New Event');
			module.loadCampaignList();
		});

		// Firebase Login Button Bindings and functions
		$('#loginButton').click(function(){
			console.log('Login Attempt');
			module.firebaseLogin();
		});

		$('#anonloginButton').click(function(){
			console.log('Anon Login Attempt');
			module.firebaseAnonLogin();
		});

		$('#signupButton').click(function(){
			console.log('Sign up Attempt');
			module.firebaseCreate();
		});

		$('#signoutButton').click(function(){
			console.log('Sign out Attempt');
			module.firebaseSignOut();
		});


		// Search Campaign list, passes current text when field is updated
		$('#createModalSearch').on('input', function() { 
			module.searchCampaignList($(this).val()); // get the current value of the input field.
		});

		// Firebase User Account Listener and CSS modifier
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
			// User is signed in.
			$('.reveal').foundation('close');

			console.log('Signed-in');
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			// ...
			// debugger
			// module.current_user = user;
			if (isAnonymous === true) {
			$('#menu_modal_button').removeClass('loggedoutFlag');
			$('#menu_modal_button').removeClass('loggedinFlag');
			$('#menu_modal_button').addClass('loggedanonFlag');
			$('#anon_user').removeClass('hidden');
			$('#current_user').addClass('hidden');
			} else {
			$('#menu_modal_button').removeClass('loggedoutFlag');
			$('#menu_modal_button').addClass('loggedinFlag');
			$('#menu_modal_button').removeClass('loggedanonFlag');
			$('#anon_user').addClass('hidden');
			$('#current_user').removeClass('hidden');
			$('.current_user_email').text(user.email);
			}
			$('#signinButton').addClass('hidden');
			$('#signoutButton').removeClass('hidden');


		} else {
			console.log('Signed-Out');
			// User is signed out.
			// ...
			$('#menu_modal_button').addClass('loggedoutFlag');
			$('#menu_modal_button').removeClass('loggedinFlag');
			$('#menu_modal_button').removeClass('loggedanonFlag');
			$('#anon_user').addClass('hidden');
			$('#current_user').addClass('hidden');
			$('#signoutButton').addClass('hidden');
			$('#signinButton').removeClass('hidden');

		}
	});


	};

// ================================================
// Firebase Login Functions
// ================================================

module.firebaseLogin = function() {
	var email = $('#loginUsername').val();
	var password = $('#loginPassword').val();
	console.log(email + ' | ' + password);

	firebase.auth().signInWithEmailAndPassword(email, password).catch(
		function(error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	console.log('Login Error:' + error.message);
	$('#loginerrorlog').text(error.message);

	});
};

module.firebaseCreate = function() {
	var email = $('#loginUsername').val();
	var password = $('#loginPassword').val();
	console.log(email + ' | ' + password);

	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	console.log('Create Account:' + error.message);
	$('#loginerrorlog').text(error.message);
	});
};

module.firebaseCurrentUser = function() {
	var user = firebase.auth().currentUser;

	if (user) {
	  // User is signed in.
	} else {
	  // No user is signed in.
	}
};

module.firebaseSignOut = function() {
	var user = firebase.auth().signOut();
};

module.firebaseAnonLogin = function() {
	firebase.auth().signInAnonymously().catch(function(error) {
	var errorCode = error.code;
	var errorMessage = error.message;
	console.log('Anon Error:' + error.message);
	$('#loginerrorlog').text(error.message);
	});
};


// ================================================
// New event modal JS
// drawCampaignList - Draws cards in the modal for each active campaign
// searchCampaignList - Adds and removes the hidden CSS tag to narrow the list
// ================================================

module.loadCampaignList = function () {
	$.ajax({url: 'https://esi.tech.ccp.is/latest/sovereignty/campaigns/?datasource=tranquility', success: function(result){
		console.log('Ajax');
		// console.log(result);
		module.campaignList = result;
		module.drawCampaignList(result);
	}});
};

module.drawCampaignList = function(data) {
	$('#CreateModalData').html('');
	for (var i = data.length - 1; i >= 0; i--) {
	// console.log(data[i]);
	// Ajax request for system data
	var d1 = $.ajax({url: 'https://esi.tech.ccp.is/latest/universe/systems/' + data[i].solar_system_id + '/?datasource=tranquility&language=en-us', success: function(){ // jshint ignore:line
	// console.log(result);
}});
	// Ajax request for structure owner data
	var d2 = $.ajax({url: 'https://esi.tech.ccp.is/latest/alliances/' + data[i].defender_id + '/?datasource=tranquility', success: function(){ // jshint ignore:line
	// console.log(result);
}});
	// Current index of passed data
	var d3 = data[i];
	$.when(i, d1, d2, d3 ).done(function (index, v1, v2, v3 ) {
		$('.loader').addClass('hidden');
		// console.log('=====================');
		// console.log('index: ' + index ); // v1 is system data
		//    console.log('System data: '); // v1 is system data
		//    console.log(v1 ); // v1 is system data
		//    console.log('Alliance data: '); // v2 is alliance data
		//    console.log(v2); // v2 is alliance data
		//    console.log('Passed Data: '); // v3 is passed in data
		//    console.log(v3); // v3 is passed in data
		var d = new Date(v3.start_time);
		// Draw Create Modal Card
		$("<div id='event_" + index + "' class='card " + v1[0].name + "'> <div class='card-divider'> <span>System Name: " + v1[0].name + " | Target Structure: <span class='capitalize'>" + v3.event_type.replace("_", " ") + "</span></span> </div> <div class='card-section'> <div>Structure Owner: " + v2[0].name + "</div> <div>Start time: " + d.toUTCString()+ "</div> <div class='button-group float-right'> <a class='button' onclick=module.addHidden(\'event_" + index +  "\') >Hide</a> <a class='button'>Map</a> <a class='button success eventCreate' onclick=module.startCampaignTool(" + v3.campaign_id + ") href='#!/example' data-close aria-label='Close modal' >Start</a> </div> </div> </div>").appendTo( "#CreateModalData" );  // jshint ignore:line
	});


}
};

module.searchCampaignList = function(val) {
	// console.log('Search for ' + val);
	$('#CreateModalData').children().each(function() {
	// console.log('search each:' + val.toUpperCase() + ' | ' + this.classList[1]);
	if (this.classList[1].includes(val.toUpperCase()) === true) {
		$(this).removeClass('hidden');
	} else {
		$(this).addClass('hidden');
	}
});
};

// ================================================
// Generic Functions
// ================================================

module.subHidden = function(id) {
	console.log('Subtract Hidden to: ' + id);
	var element = '#'+id.toString();
	$(element).removeClass('hidden');
};

module.addHidden = function(id) {
	console.log('Add Hidden to: ' + id);
	var element = '#'+id.toString();
	$(element).addClass('hidden');
};

// ================================================
// Main App Functions
// ================================================

module.startCampaignTool = function(campaingId) {
	$('.reveal').foundation('close');
	if (firebase.auth().currentUser === null) {
		console.log('Error: No user Logged in');
		// $window.location.href= '/';
	} else {
		console.log(firebase.auth().currentUser.uid);
		console.log('Start New Session for: ' + campaingId);
	}
};

