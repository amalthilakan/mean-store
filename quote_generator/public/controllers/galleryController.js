angular.module('StoreApp')
    .controller('GalleryController', function ($scope, GalleryService, $interval) {
        $scope.images = [];
        $scope.randomImage = {};

        // Fetch all stored images
        $scope.getImages = function () {
            GalleryService.getImages().then(function (response) {
                $scope.images = response.data;
                $scope.carouselImages = $scope.images; // Use all images for the carousel

                // Start auto-slide if there are images
                if ($scope.carouselImages.length > 1) {
                    startCarousel();
                }
            }).catch(function (error) {
                console.error('Error fetching images:', error);
            });
        };

        // Auto-slide logic
        function startCarousel() {
            $interval(function () {
                $scope.currentIndex = ($scope.currentIndex + 1) % $scope.carouselImages.length;
            }, 3000); // Slide every 3 seconds
        }

        // Upload Image
        $scope.uploadImage = function () {
        
            var file = $scope.imageFile;
        
            if (!file) {
                console.error("No file selected. Make sure the fileModel directive is working.");
                alert("Please select a file before uploading.");
                return;
            }
        
        
            GalleryService.uploadImage(file).then(function (response) {
                alert('Image Uploaded Successfully!');
                $scope.getImages(); // Refresh image list
            }).catch(function (error) {
                console.error('Error uploading image:', error);
            });
        };
        

        // Fetch a single image by ID
        $scope.getImageById = function (id) {
            GalleryService.getImageById(id).then(function (response) {
                var blob = new Blob([response.data], { type: 'image/jpeg' });
                var imageUrl = URL.createObjectURL(blob);
                window.open(imageUrl);  
            }).catch(function (error) {
                console.error('Error fetching image:', error);
            });
        };

        $scope.getImages();
    });
