angular.module('StoreApp')
.controller('CameraController', function($scope, CameraService) {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const capturedImage = document.getElementById('capturedImage');
    const previewWindow = document.getElementById('previewWindow');
    const ctx = canvas.getContext('2d');

    $scope.selectedFilter = 'none';

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Error accessing camera: ", err);
            alert("Could not access camera. Please check permissions.");
        });

    $scope.selectFilter = function(filter) {
        $scope.selectedFilter = filter;
        video.style.filter = filter;
    };

    $scope.takePhoto = function() {
        if (!video.videoWidth || !video.videoHeight) {
            alert("Camera not ready. Please try again.");
            return;
        }
    
        canvas.width = 800;
        canvas.height = 600;
    
        ctx.filter = $scope.selectedFilter;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        const imageDataURL = canvas.toDataURL('image/png', 0.8);
        capturedImage.src = imageDataURL;
    
        previewWindow.classList.add('show-preview');
    };

    $scope.savePhoto = function() {
        const imageData = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = imageData;
        link.download = `photo_${new Date().toISOString().replace(/[:.]/g, '-')}.png`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        $scope.closePreview();
    };

    $scope.closePreview = function() {
        previewWindow.classList.remove('show-preview');
        capturedImage.src = ''; 
    };
});