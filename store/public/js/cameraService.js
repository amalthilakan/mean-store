angular.module('StoreApp')
.service('CameraService', ['$http', 'API_BASE_URL', function($http, API_BASE_URL) {
    var baseUrl = `${API_BASE_URL}/photos`;

    this.uploadPhoto = function(photoData) {
        return $http.post(`${baseUrl}/upload`, { image: photoData }, {
            headers: { 'Content-Type': 'application/json' }
        });
    };
}])