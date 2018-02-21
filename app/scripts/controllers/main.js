'use strict';

/**
 * @ngdoc function
 * @name vrtexCampaignToolApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vrtexCampaignToolApp
 */
 angular.module('vrtexCampaignToolApp')
 .controller('MainCtrl', function ($scope) {
 	$scope.$on('$viewContentLoaded', function() {
 		console.log('Main Ready!');
 	});
 });
