angular.module('StoreApp')
.controller('AddListController', ['$scope', 'ListService', function($scope, ListService) {
    $scope.newItem = "";  
    $scope.list = [];

    function loadLists() {
        ListService.getLists().then(function(response) {
            $scope.list = response.data;
        }).catch(function(error) {
            console.error("Error fetching lists:", error);
        });
    }

    loadLists();

    $scope.addToList = function() {
        if (!$scope.newItem.trim()) {
            alert("Please enter an item.");
            return;
        }

        ListService.addList({ items: [$scope.newItem] }) 
        .then(function(response) {
            alert("Item added successfully!");
            $scope.newItem = ""; 
            loadLists(); 
        }).catch(function(error) {
            console.error("Error adding item:", error);
        });
    };

    $scope.deleteItem = function(id) {
        ListService.deleteList(id)
        .then(function(response) {
            alert("Item deleted successfully!");
            loadLists();
        }).catch(function(error) {
            console.error("Error deleting item:", error);
        });
    };
}]);
