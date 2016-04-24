'use strict';

// weather forecast application
var wfa = angular.module('wfa', ['ngRoute', 'ngResource']);


// define constants
// wfa.constant('weatherApiEndPoint', 'http://api.openweathermap.org/data/2.5/forecast/daily');
// wfa.constant('weatherApiAppId', 'dd87938102e9f4a4c73f71b7ef29a960');

wfa.constant('weatherApi', {
    'endPoint': 'http://api.openweathermap.org/data/2.5/forecast/daily',
    'token': 'dd87938102e9f4a4c73f71b7ef29a960'
});


// routes
wfa.config(['$routeProvider', function ($routeProvider) {
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
}]);


// city service
wfa.service('cityService', function ()  {
    this.city = 'Manila, MN';
});


// open weather map api
wfa.service('weatherService', ['weatherApi', '$resource', function (weatherApi, $resource) {
    var weatherAPI;
    
    this.getWeather = function (city, days) {
        weatherAPI = $resource(
            weatherApi.endPoint,
            {
                callback: 'JSON_CALLBACK'
            },
            {
                get: {
                    method: 'JSONP'
                }
            }
        );

        return weatherAPI.get({
            q: city,
            cnt: days,
            APPID: weatherApi.token
        });
    };

}]);


// home controller
wfa.controller('home', ['$scope', '$location', 'cityService', function (
    $scope,
    $location,
    cityService
) {
    $scope.city = cityService.city;

    $scope.$watch('city', function () {
        cityService.city = $scope.city;
    });

    $scope.submit = function () {
        $location.path('forecast');
    };
}]);


// forecast controller
wfa.controller('forecast', ['$scope', '$routeParams', 'cityService', 'weatherService', function (
    $scope,
    $routeParams,
    cityService,
    weatherService
) {
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '3';
    $scope.weatherResult = weatherService.getWeather($scope.city, $scope.days);

    $scope.convertToFahrenheit = function (degK) {
        return Math.round((1.8 * (degK - 273)) + 32);
    };

    $scope.convertToDate = function (dt) {
        return new Date(dt * 1000);
    };
}]);


// directives
wfa.directive('weatherReport', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/weatherReport.html',
        replace: true,
        scope: {
            weatherDay: '=',
            convertToStandard: '&',
            convertToDate: '&',
            dateFormat: '@'
        }
    };
});
