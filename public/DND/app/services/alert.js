(function(angular) {
    'use strict';
    angular.module('services.alert', ['ngMaterial'])
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('success-toast');
            $mdThemingProvider.theme('error-toast');
        })
        .service('alertService', function($mdToast) {
            this.alert = function(str, type) {
                var theToast = $mdToast.simple();
                theToast.position('bottom right');
                theToast.content(str);
                switch (type) {
                    case 0:
                        theToast.theme('error-toast');
                        break;
                    case 1:
                        theToast.theme('success-toast');
                        break;
                }
                $mdToast.show(theToast);
            };
        });
})(angular);
