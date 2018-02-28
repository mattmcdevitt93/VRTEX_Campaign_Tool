'use strict';

/**
 * @ngdoc function
 * @name vrtexCampaignToolApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the vrtexCampaignToolApp
 */
 angular.module('vrtexCampaignToolApp')
 .controller('AppCtrl', function ($scope) {
 	$scope.$on('$viewContentLoaded', function() {
 		console.log('app Ready!');
 	});
 });
