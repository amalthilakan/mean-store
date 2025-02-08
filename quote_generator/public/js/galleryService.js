angular.module('QuoteApp')
    .service('GalleryService', function ($http) {
        var baseUrl = 'http://localhost:3000/images';

        this.uploadImage = function (file) {
            var formData = new FormData();
            formData.append('image', file);

            return $http.post(baseUrl + '/upload', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        this.getImages = function () {
            return $http.get(baseUrl);
        };

        this.getImageById = function (id) {
            return $http.get(baseUrl + '/' + id, { responseType: 'arraybuffer' }); // Get image as binary data
        };
    });
