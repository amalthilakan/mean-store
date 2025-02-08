angular.module("QuoteApp").controller("CalculatorController", function ($scope) {
    $scope.num1 = 0;
    $scope.num2 = 0;
    $scope.operator = "+";
    $scope.result = 0;

    $scope.calculate = function () {
        switch ($scope.operator) {
            case "+":
                $scope.result = $scope.num1 + $scope.num2;
                break;
            case "-":
                $scope.result = $scope.num1 - $scope.num2;
                break;
            case "*":
                $scope.result = $scope.num1 * $scope.num2;
                break;
            case "/":
                $scope.result = $scope.num2 !== 0 ? $scope.num1 / $scope.num2 : "Error (div by 0)";
                break;
        }
    };
});
