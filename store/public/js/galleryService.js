angular.module('StoreApp')
    .service('GalleryService', ['$http', 'API_BASE_URL', '$q', function ($http, API_BASE_URL, $q) {
        var baseUrl = `${API_BASE_URL}/images`;
        
        this.uploadImage = function (file) {
            console.log(API_BASE_URL);
            var formData = new FormData();
            formData.append('image', file);

            return $http.post(`${API_BASE_URL}/images/upload`, formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        this.getImages = function () {
            console.log("1",baseUrl);
            return $http.get(`${API_BASE_URL}/images`);
        };

        this.getImageUrl = function (id) { // Renamed from getImageById for clarity
            return $http.get(`${baseUrl}/${id}`, { 
                responseType: 'arraybuffer',
                headers: { 
                    'Accept': 'application/octet-stream' // Explicitly request binary data
                }
            }).then(function(response) {
                const arrayBuffer = response.data;
                const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }); // Adjust type if needed (e.g., 'image/png')
                const url = URL.createObjectURL(blob);
                return $q.resolve({ url: url, _id: id }); // Return both URL and ID
            }).catch(function(error) {
                console.error('Error fetching image:', error);
                return $q.reject(error);
            });
        };
    }]);