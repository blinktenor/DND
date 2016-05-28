(function (angular) {
    'use strict';
    angular.module('services.characters', [])
            .factory('characterService', function () {

                var characters = [];
                var checkboxes = {};
                var ids = [];
                var initialized = false;

                function updateCheckboxes(values) {
                    var keyList = Object.keys(values);
                    for (var a = 0; a < keyList.length; a++) {
                        if (checkboxes[keyList[a]] === undefined) {
                            checkboxes[keyList[a]] = false;
                        }
                    }
                }
                
                function populateDefaultCheckboxes() {
                    checkboxes.name = true;
                    checkboxes.armor = true;
                    checkboxes.currentHp = true;
                    checkboxes.iMp = true;
                    checkboxes.wMp = true;
                    initialized = true;
                }

                return {
                    initialized: initialized,
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
                        if (!initialized) populateDefaultCheckboxes();
                    },
                    removePlayer: function (id) {
                        
                    }
                };
            });
})(angular);