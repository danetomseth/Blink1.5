core.factory('ClmFactory', function(KeyboardFactory) {
    let brows;
    let zeroBrow;
    const defaultThreshold = 5;
    //start tracker
    var ctracker; // = new clm.tracker();
    let canvas;
    let context;
    let video;
    let run = true;

    let out = {
        initialize: (canvasItem, videoItem, trackerItem, contextItem) => {
            canvas = canvasItem;
            video = videoItem;
            context = contextItem;
            ctracker = trackerItem;
        },
        //set zero
        zero: () => {
            zeroBrow = brows;
        },
        //initial canvas drawing
        positionLoop: () => {
                requestAnimationFrame(out.positionLoop);
                if (KeyboardFactory.run()) {
                    let positions = ctracker.getCurrentPosition();
                    if (positions) {
                        //find the Y coord of both brows and add them to get a base number
                        brows = positions[20][1] + positions[17][1];
                        out.browSelect(KeyboardFactory.selectLetter);
                    }
                }
        },
        drawLoop: () => {
            requestAnimationFrame(out.drawLoop);
            context.clearRect(0, 0, canvas.width, canvas.height);
            ctracker.draw(canvas);
        },
        percentChange: () => {
            return (zeroBrow - brows) / zeroBrow * 100;
        },
        //if brows lift, run a function
        browSelect: (fn, thresh) => {
            let threshold = thresh || defaultThreshold;
            console.log(out.percentChange())
            if (out.percentChange() > threshold) {
                console.log("trigger");
                fn();
            }
        }
    }

    return out;
});
