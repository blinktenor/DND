var dm = angular.module('dm', []);

dm.controller('dmController', function ($scope) {

    $scope.diceSideOptions = [3, 4, 6, 8, 10, 12, 20];

    $scope.rollDice = function () {
        
        $scope.result = "";

        for (var a = 0; a < $scope.numRolls; a++) {
            if (a !== 0) {
                $scope.result = $scope.result + " - ";
            }
            $scope.result = $scope.result + Math.floor((Math.random() * $scope.diceSides) + 1);
        }
    };
});