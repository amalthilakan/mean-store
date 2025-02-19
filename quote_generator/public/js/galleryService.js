angular.module('StoreApp')
    .service('GalleryService', ['$http', 'API_BASE_URL', function ($http, API_BASE_URL) {
        var baseUrl = `${API_BASE_URL}/images`;

        this.uploadImage = function (file) {
            var formData = new FormData();
            formData.append('image', file);

            return $http.post(`${baseUrl}/upload`, formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        this.getImages = function () {
            return $http.get(baseUrl);
        };

        this.getImageById = function (id) {
            return $http.get(`${baseUrl}/${id}`, { responseType: 'arraybuffer' });
        };
    }]);
