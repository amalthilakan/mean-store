angular.module('StoreApp')

.controller('MainController', ['$scope', function($scope) {
    $scope.appTitle = "Tool Store";
}])

.controller('HomeController', ['$scope', function($scope) {
    $scope.home = "Home Page";
}])

.controller('AboutController', ['$scope', function($scope) {
    $scope.message = "Welcome to the About Page!";
}]);
