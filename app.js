'use strict';

// weather forecast application
var wfa = angular.module('wfa', ['ngRoute', 'ngResource']);


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
wfa.controller('forecast', ['$scope', '$resource', 'cityService', function (
    $scope,
    $resource,
    cityService
) {
    // http://api.openweathermap.org/data/2.5/forecast/daily
    // ?APPID=dd87938102e9f4a4c73f71b7ef29a960
    var weatherAPIPath = 'http://api.openweathermap.org/data/2.5/forecast/daily' + 
        '?APPID=dd87938102e9f4a4c73f71b7ef29a960';
    $scope.city = cityService.city;

    $scope.weatherAPI = $resource(
        weatherAPIPath,
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
        cnt: 5
    });


    $scope.convertToFahrenheit = function (degK) {
        return Math.round((1.8 * (degK - 273)) + 32);
    };


    $scope.convertToDate = function (dt) {
        return new Date(dt * 1000);
    };

    console.log($scope.weatherResult);
}]);
