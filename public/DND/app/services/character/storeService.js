(function (angular) {
    'use strict';
    angular.module('services.store', [])
            .factory('storeService', function () {

    var store = {};

    return {
        store: store
    };
});
})(angular);