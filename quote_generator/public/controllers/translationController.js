angular.module('StoreApp')
.controller('TranslationController', function($scope, $timeout, TranslationService) {
    $scope.inputText = "";
    $scope.translatedText = "";
    $scope.copySuccess = false;

    $scope.translate = function() {
        if ($scope.inputText.trim() !== "") {
            TranslationService.translateText($scope.inputText)
                .then(function(response) {
                    $scope.translatedText = response.data.translatedText;
                })
                .catch(function(error) {
                    console.error("Translation failed:", error);
                    $scope.translatedText = "Translation error!";
                });
        }
    };

    $scope.copyToClipboard = function () {
        if (!$scope.translatedText) return;

        navigator.clipboard.writeText($scope.translatedText).then(function () {
            $scope.$applyAsync(() => {
                $scope.copySuccess = true;
            });

            $timeout(function () {
                $scope.copySuccess = false;
            }, 1500);
        }).catch(function (err) {
            console.error("Copy failed: ", err);
        });
    };
});