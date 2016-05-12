angular.module('dm').factory('imageService', function () {

    var waitingToRender = 0;
    var renderList;
    var images = {};
    var canvas;
    var imagesToShow;

    /**
     * This is going to show everything that has been clicked, not current selected
     * @returns {undefined}
     */
    function fillContext() {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var a = 0; a < imagesToShow.length; a++) {
            var img = images[imagesToShow[a]];
            //not sure why this is undefined...
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

    function renderImage(imageName) {
        var image = new Image();
        image.src = imageName;
        images[imageName] = image;
        waitingToRender--;
        if (waitingToRender === 0) {
            fillContext();
        }
    }

    return {
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
        setCanvas: function (newCanvas) {
            canvas = newCanvas;
        }
    };
});