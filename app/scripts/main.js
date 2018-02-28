'use strict';
// ================================================
// Function Prototypes and placeholders
// ================================================
var module = module || {};
var firebase = firebase || {};
var config = config || {};
var Cookies = Cookies || {};

function testData(data) {
	firebase.database().ref().set({
		test: data
	});
}

module.urlParams = function(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results===null){
		return null;
	}
	else{
		return decodeURI(results[1]) || 0;
	}
};

// ================================================
// Document Ready
// ================================================

$(document).ready(function() {
	console.log('Document Ready!');
	firebase.initializeApp(config);
	module.firebaseRef = firebase.database().ref();
	module.bindings();
	// $(document).foundation();
	// module.postBinding();
	// testData(1);
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

		// Anonomous Login (Sets temp display name)
		$('#anonloginButton').click(function(){
			console.log('Anon Login Attempt');
			module.firebaseAnonLogin();
		});

		// Create New Account
		$('#signupButton').click(function(){
			console.log('Sign up Attempt');
			module.firebaseCreate();
		});

		// Sign out
		$('#signoutButton').click(function(){
			console.log('Sign out Attempt');
			module.firebaseSignOut();
		});


		// Update Settings Menu field
		$('#displayNameUpdateButton').click(function(){
			console.log('Update Display Attempt:' + $('#displayNameUpdate').val());
			module.setNewDisplayName($('#displayNameUpdate').val(),null , false);
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
				$('#loggedInAsIcon').removeClass('loggedoutFlag');
				$('#loggedInAsIcon').removeClass('loggedinFlag');
				$('#loggedInAsIcon').addClass('loggedanonFlag');
				$('#anon_user').removeClass('hidden');
				$('#current_user').addClass('hidden');

				// Set Display name if not set
				if (user.displayName === undefined || user.displayName === null || user.displayName === '') {
					console.log('Display Name Reset');
					module.setNewDisplayName(null, true);
				}
			} else {
				// User has an email and is a registered user
				$('#loggedInAsIcon').removeClass('loggedoutFlag');
				$('#loggedInAsIcon').addClass('loggedinFlag');
				$('#loggedInAsIcon').removeClass('loggedanonFlag');
				$('#anon_user').addClass('hidden');
				$('#current_user').removeClass('hidden');
				if (user.displayName === null) {
					module.setNewDisplayName(user.email.replace(/@[^@]+$/, '', false));

				}


			}
		// Update Login Buttons and close modals
		$('#signinButton').addClass('hidden');
		$('#signoutButton').removeClass('hidden');
		$('#loggedInAsIcon').attr('data-open', 'UserSettingsModal');


		// // Update Display Name in Settings fields
		// $('.displayName').text(user.displayName);
		// // $('#loggedInAsIcon').text(user.displayName);
		// $('#displayNameUpdate').val(user.displayName);
		// console.log('Display Name: ' + user.displayName);
		module.updateDisplayNames(user.displayName);



	} else {
		console.log('Signed-Out');
			// User is signed out.
			// ...
			$('#loggedInAsIcon').addClass('loggedoutFlag');
			$('#loggedInAsIcon').removeClass('loggedinFlag');
			$('#loggedInAsIcon').removeClass('loggedanonFlag');
			$('#anon_user').addClass('hidden');
			$('#current_user').addClass('hidden');
			$('#signoutButton').addClass('hidden');
			$('#signinButton').removeClass('hidden');
			$('#loggedInAsIcon').text('Signed-Out');
			$('#loggedInAsIcon').removeAttr('data-open');

		}
	});

	};

// ================================================
// Firebase Login Functions
// ================================================

module.firebaseLogin = function() {
	var email = $('#loginUsername').val();
	var password = $('#loginPassword').val();
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

module.loadCampaignList = function (id) {
	if (id === undefined) {
		$.ajax({url: 'https://esi.tech.ccp.is/latest/sovereignty/campaigns/?datasource=tranquility', success: function(result){
			console.log('Ajax');
			// console.log(result);
			module.campaignList = result;
			module.drawCampaignList(result);
		}});
	} else {
		$.ajax({url: 'https://esi.tech.ccp.is/latest/sovereignty/campaigns/?datasource=tranquility', success: function(result){
			console.log('Ajax');
			// console.log('Find Result:' + id);
		// console.log('Results: ' + result);
		var resultPush = [];
		for (var i = result.length - 1; i >= 0; i--) {
			// console.log('Campaign ID: ' + i + ' | ' + result[i].campaign_id);
			if (id === result[i].campaign_id) {
				resultPush.push(result[i]);
			}
		}
		return resultPush[0];
	}});
	}

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
		   // console.log(v1 ); // v1 is system data
		//    console.log('Alliance data: '); // v2 is alliance data
		   // console.log(v2); // v2 is alliance data
		//    console.log('Passed Data: '); // v3 is passed in data
		   // console.log(v3); // v3 is passed in data
		   var d = new Date(v3.start_time);
		// Draw Create Modal Card
		// Currently Start button is directing to Example.html
		$("<div id='event_" + index + "' class='card " + v1[0].name + "'> <div class='card-divider'> <span>System Name: " + v1[0].name + " | Target Structure: <span class='capitalize'>" + v3.event_type.replace("_", " ") + "</span></span> </div> <div class='card-section'> <div>Structure Owner: " + v2[0].name + "</div> <div>Start time: " + d.toUTCString()+ "</div> <div class='button-group float-right'> <a class='button' onclick=module.addHidden(\'event_" + index +  "\') >Hide</a> <a class='button'>Map</a> <a class='button success eventCreate' onclick=module.startCampaignTool(" + v3.campaign_id + ") href='#!/app' data-close aria-label='Close modal' >Start</a> </div> </div> </div>").appendTo( "#CreateModalData" );  // jshint ignore:line
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

module.setNewDisplayName = function(name, anon, reload) {
	console.log('Display Name to Set:' + name);
	var user = firebase.auth().currentUser;
	if (name !== null) {
		user.updateProfile({
			displayName: name,
		}).then(function() {
			console.log('Display Name Set');
			module.updateDisplayNames(user.displayName);
			if (reload === true) {
				location.reload();
			}
		}).catch(function(error) {
			console.log('Display Name Error: ' + error);
			if (reload === true) {
				location.reload();
			}
		});
	} else {
		console.log('Random Name Set');
		if (anon === true) {
			var nameList = ['Anonymousl Coward', 'Filthy Casaual', 'Nameless Noob', 'Fun Vampire', 'Dirty Lurker', 'Hairy Larry'];
			var tempName = nameList[Math.floor(Math.random()*nameList.length)] + ' #' + (Math.floor(Math.random() * (999 - 100) ).toString());
			console.log('Name Set: '+ tempName);
			module.setNewDisplayName(tempName, anon, true);
		}
	}

};

module.updateDisplayNames = function (name) {
	// console.log('update DisplayName: ' + name);
	if (name === undefined) {
		var user = firebase.auth().currentUser;
		$('.displayName').text(user.displayName);
		$('#displayNameUpdate').val(user.displayName);
		$('#loggedInAsIcon').text(user.displayName);

	} else {
		$('.displayName').text(name);
		$('#displayNameUpdate').val(name);	
		$('#loggedInAsIcon').text(name);
	}

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
		console.log('===================');
		var current_user = firebase.auth().currentUser;
		console.log('Current User: ' + current_user.uid);
		var d1 = current_user;
		console.log('Campaign ID: ' + campaingId);


		var d2 = $.ajax({url: 'https://esi.tech.ccp.is/latest/sovereignty/campaigns/?datasource=tranquility', success: function(result){
			console.log('Ajax');
			console.log('Find Result:' + campaingId);
			// console.log('Results: ' + result);
		}});

		console.log('Campaign Data: ' + d2);
		console.log('Create Firebase Object for new Event');

		$.when(d1, d2, d3).then(function (v1, v2, v3) {
		// console.log('=====================');
		// console.log('index: ' + index ); // v1 is system data
		//    console.log('System data: '); // v1 is system data
		// console.log(v1); // v1 is user data
		//    console.log('Alliance data: '); // v2 is alliance data
		// console.log(v2[0]); // v2 is campaign data
		//    console.log('Passed Data: '); // v3 is passed in data
		// console.log(v3); // v3 is passed in data
		// var d = new Date(v3.start_time);
		// Draw Create Modal Card
		// Currently Start button is directing to Example.html

		var resultPush = [];
			for (var i = v2[0].length - 1; i >= 0; i--) {
				// console.log('Campaign ID: ' + i + ' | ' + v2[0][i].campaign_id);
				if (campaingId === v2[0][i].campaign_id) {
					resultPush.push(v2[0][i]);
					// console.log('Campaign ID: Match');
				}
			}
		var a2 = resultPush[0];
		// console.log('current Campaign: ' + a2);

		var newSession = {
			data: { 
				creatingUser: v1.uid,
				currentOwner: v1.uid, 
				campaingId: a2.campaign_id,
				attackersScore: a2.attackers_score,
				defenderScore: a2.defender_score,
				constellationId: a2.constellation_id,
				defenderId: a2.defender_id,
				eventType: a2.event_type,
				solarSystem_id: a2.solar_system_id,
				startTime: a2.start_time,
				structureId: a2.structure_id
				}, 

				users: {
					[v1.uid]: {
						displayName: v1.displayName
					}
				}, 
				log: {
					0: {
						type: 'Initial Log!'
					}
				},
				nodes: {
					0: {
						type: 'Initial Event!'
					}
				}

			};
			var refKey = module.firebaseRef.push(newSession);

			console.log('Firebase Key:' + refKey.key);
		});








		// var newSession = {
		// 	data: { 
		// 		creatingUser: current_user.uid,
		// 		currentOwner: current_user.uid, 
		// 		campaingId: campaingId }, 
		// 	users: {
		// 		[current_user.uid]: {
		// 			displayName: current_user.displayName
		// 		}
		// 	}, 
		// 	log: {
		// 		0: {
		// 			type: 'Initial Log!'
		// 		}
		// 	},
		// 	nodes: {
		// 		0: {
		// 			type: 'Initial Event!'
		// 		}
		// 	}

		// };

		// var refKey = module.firebaseRef.push(newSession);

		// console.log('Firebase Key:' + refKey.key);

		console.log('Create sessionID as cookie');
		console.log('===================');

	}
};

module.postBinding = function() {
	console.log('Session Start - Variable / Cookie Check');
		// var u = firebase.auth().currentUser;
		// // var c = null
		// $.when(u, c).done(function (user, campaign) {
		// // console.log('=====================');
		// console.log('User: ' + user ); // v1 is system data
		// //    console.log('System data: '); // v1 is system data
		//    // console.log(v1 ); // v1 is system data
		// //    console.log('Alliance data: '); // v2 is alliance data
		//    // console.log(v2); // v2 is alliance data
		// //    console.log('Passed Data: '); // v3 is passed in data
		//    // console.log(v3); // v3 is passed in data
		//    // var d = new Date(v3.start_time);
		// // Draw Create Modal Card
		// // Currently Start button is directing to Example.html
	// });
};

