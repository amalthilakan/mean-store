angular.module('QuoteApp')
.factory('QuoteService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
    return {
        getQuotes: function() {
            return $http.get(`${API_BASE_URL}/quote`);
        },
        addQuote: function(quote) {
            return $http.post(`${API_BASE_URL}/quote`, quote);
        },
        deleteQuote: function(id) {
            return $http.delete(`${API_BASE_URL}/quote/${id}`);
        },
        getRandomFact: function() {
            return $http.get(`${API_BASE_URL}/facts`);
        }
    };
}]);