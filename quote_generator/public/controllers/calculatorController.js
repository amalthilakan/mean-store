angular.module("StoreApp")
.controller('CalculatorController', function($scope) {
    $scope.display = '';

    $scope.append = function(value) {
        $scope.display += value;
    };

    $scope.calculate = function() {
        try {
            $scope.display = eval($scope.display);
        } catch (e) {
            $scope.display = "Error";
        }
    };

    $scope.clear = function() {
        $scope.display = '';
    };
});
