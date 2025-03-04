angular.module('StoreApp')
    .controller('TicTacToeController', function($scope) {
        $scope.board = Array(9).fill(null);
        $scope.currentPlayer = 'X';
        $scope.winner = null;
        $scope.draw = false;

        $scope.makeMove = function(index) {
            if (!$scope.board[index] && !$scope.winner && !$scope.draw) {
                $scope.board[index] = $scope.currentPlayer;
                checkWinner();
                if (!$scope.winner && !$scope.draw) {
                    $scope.currentPlayer = $scope.currentPlayer === 'X' ? 'O' : 'X';
                }
            }
        };

        // Check for a winner or draw
        function checkWinner() {
            const winConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6]             // Diagonals
            ];

            for (let condition of winConditions) {
                const [a, b, c] = condition;
                if ($scope.board[a] && $scope.board[a] === $scope.board[b] && $scope.board[a] === $scope.board[c]) {
                    $scope.winner = $scope.board[a];
                    return;
                }
            }

            // Check for draw
            if (!$scope.board.includes(null) && !$scope.winner) {
                $scope.draw = true;
            }
        }

        // Reset the game
        $scope.resetGame = function() {
            $scope.board = Array(9).fill(null);
            $scope.currentPlayer = 'X';
            $scope.winner = null;
            $scope.draw = false;
        };
    });