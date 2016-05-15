(function (angular) {
    'use strict';
    angular.module('services.characters', [])
            .factory('characterService', function () {

                var ids = [];
                var characters = [];
                var checkboxes = {};

                function updateCheckboxes(values) {
                    var keyList = Object.keys(values);
                    for (var a = 0; a < keyList.length; a++) {
                        if (checkboxes[keyList[a]] === undefined) {
                            checkboxes[keyList[a]] = false;
                        }
                    }
                }

                return {
                    characters: characters,
                    checkboxes: checkboxes,
                    pushPlayerData: function (playerData) {
                        if (ids.indexOf(playerData.id) > -1) {
                            for (var a = 0; a < characters.length; a++) {
                                if (characters[a].id === playerData.id) {
                                    characters[a].value = playerData.value;
                                }
                            }
                        } else {
                            ids.push(playerData.id);
                            characters.push(playerData);
                        }
                        updateCheckboxes(playerData.value);
                    },
                    removePlayer: function (id) {
                        
                    }
                };
            });
})(angular);