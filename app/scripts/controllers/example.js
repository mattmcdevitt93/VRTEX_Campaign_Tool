'use strict';

/**
 * @ngdoc function
 * @name vrtexCampaignToolApp.controller:ExampleCtrl
 * @description
 * # ExampleCtrl
 * Controller of the vrtexCampaignToolApp
 */
angular.module('vrtexCampaignToolApp')
  .controller('ExampleCtrl', function ($scope) {
 	$scope.$on('$viewContentLoaded', function() {
 		console.log('Example Ready!');
 	});
  });
