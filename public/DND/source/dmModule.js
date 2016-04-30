var dm = angular.module('dm', []);

dm.controller('dmController', function($scope) {
    
    $scope.diceRoll = function () {
        alert('dice!');
    }
});