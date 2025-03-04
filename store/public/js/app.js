angular.module("StoreApp", ["ngRoute"]).config([
  "$routeProvider",
  "$locationProvider",
  function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("");
    $routeProvider
      .when("/", {
        templateUrl: "views/home.html",
        controller: "HomeController",
      })
      .when("/list", {
        templateUrl: "views/list.html",
        controller: "AddListController",
      })
      // .when("/gallery", {
      //   templateUrl: "views/gallery.html",
      //   controller: "GalleryController",
      // })
      .when("/calculator", {
        templateUrl: "views/calculator.html",
        controller: "CalculatorController",
      })
      .when("/about", {
        templateUrl: "views/about.html",
        controller: "AboutController",
      })
      .when("/translation", {
        templateUrl: "views/translation.html",
        controller: "TranslationController",
      })
      .when("/camera", {
        templateUrl: "views/camera.html",
        controller: "CameraController",
      })
      .when('/tictactoe', {
        templateUrl: 'views/ticTacToe.html',
        controller: 'TicTacToeController'
      })
      .otherwise({
        redirectTo: "/",
      });
  },
]);
