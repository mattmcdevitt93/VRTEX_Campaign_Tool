'use strict';
// var module = module || {};
var firebase = firebase || {};
firebase.initializeApp(config);
testData(1);
function testData(data) {
  firebase.database().ref().set({
    test: data
  });
}