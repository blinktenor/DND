(function (angular) {
    'use strict';
    angular.module('services.image', [])
            .factory('imageService', function () {

                var canvas;
                var images = {};
                var imagesToShow;
                var initialized = false;
                var mapCollection;
                var mapData;
                var renderList;
                var waitingToRender = 0;

                function fillContext() {
                    if (imagesToShow !== undefined) {
                        var context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        for (var a = 0; a < imagesToShow.length; a++) {
                            var img = images[imagesToShow[a]];
                            if (img !== undefined) {
                                if (canvas.width < img.width) {
                                    canvas.width = img.width;
                                }
                                if (canvas.height < img.height) {
                                    canvas.height = img.height;
                                }
                                context.drawImage(img, 0, 0);
                            }
                        }
                    }
                }

                function renderImage(imageName) {
                    var image = new Image();
                    image.onload = function () {
                        waitingToRender--;
                        if (waitingToRender === 0) {
                            fillContext();
                        }
                    };
                    image.src = imageName;
                    images[imageName] = image;
                }

                return {
                    initialized: initialized,
                    loadImages: function (imagesToRender) {
                        imagesToShow = imagesToRender;
                        renderList = imagesToRender;
                        for (var a = 0; a < imagesToRender.length; a++) {
                            if (images[imagesToRender[a]] === undefined) {
                                waitingToRender++;
                                renderImage(imagesToRender[a]);
                            }
                        }
                        if (waitingToRender === 0) {
                            fillContext();
                        }
                    },
                    mapCollection: mapCollection,
                    mapData: mapData,
                    resetImage: function () {
                        fillContext();
                    },
                    setCanvas: function (newCanvas) {
                        canvas = newCanvas;
                    }
                };
            });
})(angular);