angular.module('QuoteApp', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
    })
    .when('/add-quote', {
        templateUrl: 'views/add-quote.html',
        controller: 'AddQuoteController'
    })
    .when('/random-fact', { 
        templateUrl: 'views/random-fact.html',
        controller: 'RandomFactController'
    })
    .when('/pokemon-gallery', {
        templateUrl: 'views/pokemon-gallery.html',
        controller: 'PokemonGalleryController'
    })
    .when('/calculator', {
        templateUrl: "views/calculator.html",
        controller: "CalculatorController"
    })
    .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
    })
    .when('/gallery', {
        templateUrl: 'views/gallery.html',
        controller: 'GalleryController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);
