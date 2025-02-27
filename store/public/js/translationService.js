angular.module('StoreApp')
.service("TranslationService", ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
    this.translateText = function(text) {
        return $http.post(`${API_BASE_URL}/translate`, { text: text });
    };
}]);
