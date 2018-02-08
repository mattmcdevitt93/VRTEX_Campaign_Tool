'use strict';

/**
 * @ngdoc overview
 * @name vrtexCampaignToolApp
 * @description
 * # vrtexCampaignToolApp
 *
 * Main module of the application.
 */
 angular
 .module('vrtexCampaignToolApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch'
  ])
 .config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    controllerAs: 'main'
  })
  .when('/about', {
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl',
    controllerAs: 'about'
  })
  .when('/404', {
    templateUrl: '404.html',
    controller: '404Controller'
  })
  .otherwise({
    redirectTo: '/'
  });

});
