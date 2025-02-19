angular.module('StoreApp')
.factory('ListService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
    return {
        getLists: function() {
            return $http.get(`${API_BASE_URL}/lists`);
        },
        addList: function(list) {
            return $http.post(`${API_BASE_URL}/lists`, list);
        },
        deleteList: function(id) {
            return $http.delete(`${API_BASE_URL}/lists/${id}`);
        }
    };
}]);
