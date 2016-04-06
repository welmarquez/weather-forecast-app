'use strict';

// weather forecast application
var wfa = angular.module('wfa', ['ngRoute', 'ngResource']);


// define constants
wfa.constant('weatherApiEndPoint', 'http://api.openweathermap.org/data/2.5/forecast/daily');
wfa.constant('weatherApiAppId', 'dd87938102e9f4a4c73f71b7ef29a960');


// routes
wfa.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'home'
        })
        .when('/forecast', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecast'
        })
        .when('/forecast/:days', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecast'
        });
});


// service
// open weather map api
wfa.service('cityService', function ()  {
    this.city = 'Manila, MN';
});


// home controller
wfa.controller('home', ['$scope', 'cityService', function (
    $scope,
    cityService
) {
    $scope.city = cityService.city;

    $scope.$watch('city', function () {
        cityService.city = $scope.city;
    });
}]);


// forecast controller
wfa.controller('forecast', ['$scope', '$resource', '$routeParams', 'cityService', 'weatherApiEndPoint', 'weatherApiAppId', function (
    $scope,
    $resource,
    $routeParams,
    cityService,
    weatherApiEndPoint,
    weatherApiAppId
) {
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '3';

    $scope.weatherAPI = $resource(
        weatherApiEndPoint,
        {
            callback: 'JSON_CALLBACK'
        },
        {
            get: {
                method: 'JSONP'
            }
        }
    );


    $scope.weatherResult = $scope.weatherAPI.get({
        q: $scope.city,
        cnt: $scope.days,
        APPID: weatherApiAppId
    });


    $scope.convertToFahrenheit = function (degK) {
        return Math.round((1.8 * (degK - 273)) + 32);
    };


    $scope.convertToDate = function (dt) {
        return new Date(dt * 1000);
    };
}]);
