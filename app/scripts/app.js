'use strict';
var module = module || {};
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
  .when('/example', {
    templateUrl: 'views/example.html',
    controller: 'ExampleCtrl',
    controllerAs: 'example'
  })
  .when('/404', {
    templateUrl: '404.html',
    controller: '404Controller'
  })
  .otherwise({
    redirectTo: '/'
  });
}).run(function($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        console.log('loaded!');
        $(document).foundation();
        // module.bindings();
    });
});


