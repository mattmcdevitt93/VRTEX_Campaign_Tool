'use strict';
// var module = module || {};
var firebase = firebase || {};
var config = config || {};

function testData(data) {
  firebase.database().ref().set({
    test: data
  });
}

$(document).ready(function() {
	console.log('Ready!');
	$(document).foundation();
	// Module.bindings();
	firebase.initializeApp(config);
	testData(1);
});