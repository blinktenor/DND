(function (angular) {
    'use strict';
    angular.module('services.store', [])
            .factory('storeService', function () {

    var storeTableData = {};

    return {
        storeTableData: storeTableData
    };
});
})(angular);