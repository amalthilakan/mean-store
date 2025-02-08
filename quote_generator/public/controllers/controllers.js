angular.module('QuoteApp')

.controller('MainController', ['$scope', function($scope) {
    $scope.appTitle = "Random Quote Generator";
}])

.controller('HomeController', ['$scope', 'QuoteService', function($scope, QuoteService) {
    $scope.quotes = [];
    $scope.randomQuote = null;

    // Fetch all quotes
    function loadQuotes() {
        QuoteService.getQuotes().then(function(response) {
            $scope.quotes = response.data;
        }).catch(function(error) {
            console.error("Error fetching quotes:", error);
        });
    }

    // Get random quote
    $scope.getRandomQuote = function() {
        if ($scope.quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * $scope.quotes.length);
            $scope.randomQuote = $scope.quotes[randomIndex];
        }
    };

    loadQuotes();
}])

.controller('AddQuoteController', ['$scope', 'QuoteService', function($scope, QuoteService) {
    $scope.newQuote = {};
    $scope.quotes = [];

    function loadQuotes() {
        QuoteService.getQuotes().then(function(response) {
            console.log("dasd")
            $scope.quotes = response.data;
        }).catch(function(error) {
            console.error("Error fetching quotes:", error);
        });
    }

    loadQuotes();

    $scope.addQuote = function() {
        if (!$scope.newQuote.text || !$scope.newQuote.author) {
            alert("Please enter both text and author.");
            return;
        }

        QuoteService.addQuote($scope.newQuote)
        .then(function(response) {
            alert("Quote added successfully!");
            $scope.newQuote = {};
            loadQuotes();
        }).catch(function(error) {
            console.error("Error adding quote:", error);
        });
    };

    $scope.deleteQuote = function(id) {
        QuoteService.deleteQuote(id)
        .then(function(response) {
            alert("Quote deleted successfully!");
            loadQuotes();
        }).catch(function(error) {
            console.error("Error deleting quote:", error);
        });
    };
}])


.controller('AboutController', ['$scope', function($scope) {
    $scope.message = "Welcome to the About Page!";
}]);
