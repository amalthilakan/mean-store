angular.module('StoreApp')
    .controller('GalleryController', function ($scope, GalleryService, $interval) {
        $scope.images = [];
        $scope.carouselImages = [];
        $scope.currentIndex = 0;
        $scope.imageFile = null;

        // Custom directive to handle file input (file-model)
        angular.module('StoreApp').directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function() {
                        scope.$apply(function() {
                            modelSetter(scope, element[0].files[0]);
                            console.log('Selected file:', element[0].files[0] ? element[0].files[0].name : 'No file');
                        });
                    });
                }
            };
        }]);

        // Upload Image
        $scope.uploadImage = function () {
            if (!$scope.imageFile) {
                console.error("No file selected. Make sure the fileModel directive is working.");
                alert("Please select a file before uploading.");
                return;
            }

            GalleryService.uploadImage($scope.imageFile)
                .then(function (response) {
                    alert('Image Uploaded Successfully!');
                    $scope.imageFile = null; // Reset file input
                    document.getElementById('fileInput').value = ''; // Clear file input visually
                    $scope.getImages(); // Reload images after upload
                })
                .catch(function (error) {
                    console.error('Error uploading image:', error);
                    alert('Error uploading image: ' + (error.data?.message || error.message));
                });
        };

        // Fetch all stored images
        $scope.getImages = function () {
            GalleryService.getImages()
                .then(function (response) {
                    $scope.images = response.data;
                    $scope.carouselImages = angular.copy($scope.images); // Use all images for the carousel

                    // Preload image URLs for carousel and grid
                    $scope.images.forEach(image => {
                        $scope.getImageUrl(image._id).then(data => {
                            image.url = data.url; // Store the Blob URL for the grid
                        });
                    });

                    // Preload carousel image URLs
                    $scope.carouselImages.forEach(image => {
                        $scope.getImageUrl(image._id).then(data => {
                            image.url = data.url; // Store the Blob URL for the carousel
                        });
                    });

                    // Start auto-slide if there are images
                    if ($scope.carouselImages.length > 1) {
                        startCarousel();
                    }
                })
                .catch(function (error) {
                    console.error('Error fetching images:', error);
                    alert('Error fetching images: ' + (error.data?.message || error.message));
                });
        };

        // Auto-slide logic
        function startCarousel() {
            $interval(function () {
                $scope.currentIndex = ($scope.currentIndex + 1) % $scope.carouselImages.length;
            }, 3000); // Slide every 3 seconds
        }

        // Fetch a single image by ID and return Blob URL
        $scope.getImageUrl = function (id) {
            return GalleryService.getImageUrl(id) // Renamed from getImageById for clarity
                .then(function (data) {
                    return data; // Return the object with { url, _id }
                })
                .catch(function (error) {
                    console.error('Error getting image URL:', error);
                    return { url: '', _id: id }; // Fallback
                });
        };

        // Load images on controller initialization
        $scope.getImages();
    });