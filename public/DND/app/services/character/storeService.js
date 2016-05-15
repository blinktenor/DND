(function (angular) {
    'use strict';
    angular.module('services.store', [])
            .factory('storeService', function () {

    var storeTableData = null;

    return {
        storeTableData: storeTableData
    };
});
})(angular);