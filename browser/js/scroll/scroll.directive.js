core.directive('blLetterScroll', function(ScrollFactory) {
    return {
        restrict: 'E',
        templateUrl: 'templates/scroll-letter.html',
        controller: 'ScrollCtrl',
        scope: '=',
        link: function(scope, elem, attr) {

            scope.ready = false;
            scope.imageStable = false;



            scope.rowSelect = true;
            scope.letterSelect = false;
            scope.sentence = ''
            scope.selectedText = "";

            scope.alphabet = [
                ["A", "B", "C", "D", "E", "Yes"],
                ["F", "G", "H", "I", "J", "No"],
                ["K", "L", "M", "N", "O", "*"],
                ["P", "Q", "R", "S", "T", "/"],
                ["U", "V", "W", "X", "Y", "Z"],
                ["0", "1", "2", "3", "4", "+"],
                ["5", "6", "7", "8", "9", "-"]
            ];
            //let coords = [0, 0]; //Current spot in alphabet array

            // scope.selectArray = [
            //     ['A', 'B', 'C', 'D', 'E'],
            //     ['F', 'G', 'H', 'I', 'J'],
            //     ['K', 'L', 'M', 'N', 'O'],
            //     ['P', 'Q', 'R', 'S', 'T'],
            //     ['U', 'V', 'W', 'X', 'Y'],
            //     ['Z', 'Back', '+ Word', '?', '?']
            // ]
            scope.styleArray = [
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ]

            scope.letterIndex = 0;
            scope.rowArray = [0, 0, 0, 0, 0, 0];
            scope.rowIndex = 0;


            //threshold for detection
            scope.browThreshold = 25;

            var browZeroArray = [];
            var browDebounce = true;


            var browArray = [20, 21, 17, 16];

            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
            var errorCallback = function(e) {
                console.log('Reeeejected!', e);
            };
            var video = document.getElementById('webcam');

            //start tracker
            var ctracker = new clm.tracker();
            ctracker.init(pModel);
            ctracker.start(video);
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");


            

            //all interval based logic
            var intervalRead;

            function takeReading() {
                intervalRead = setInterval(readPositions, 50)
            }


            //ready to start selecting letters
            scope.startLetters = function() {
                scope.ready = true;
                startRow();
            }

            //sets [0][0] to green
            function startRow() {
                scope.rowArray = [1, 0, 0, 0, 0, 0];
                scope.rowIndex = 0;
            }


            var cursorInterval;

            function moveCursor() {
                cursorInterval = setInterval(selectRow, 500)
            }

            function selectRow(back) {
                scope.rowArray[scope.rowIndex] = 0;
                if (back) {
                    scope.rowIndex--;
                    if (scope.rowIndex === -1) scope.rowIndex = scope.rowArray.length - 1;
                    scope.rowArray[scope.rowIndex] = 1;
                } else {
                    scope.rowIndex++;
                    if (scope.rowIndex === scope.rowArray.length) scope.rowIndex = 0;
                    scope.rowArray[scope.rowIndex] = 1;
                }
            }


            //moves cursor across letters
            function selectLetter() {
                scope.styleArray[scope.rowIndex][scope.letterIndex] = 0;
                scope.letterIndex++;
                if (scope.letterIndex > 4) scope.letterIndex = 0;
                scope.styleArray[scope.rowIndex][scope.letterIndex] = 1;
            }


            //moves cursor across rows
            function resetRow() {
                scope.rowArray[scope.rowIndex] = 1;
                scope.styleArray[scope.rowIndex][scope.letterIndex] = 0
                scope.letterIndex = 0;
                scope.rowSelect = true;
                scope.letterSelect = false;
            }

            //pushes letter into input, checks for special chars
            function pushLetter() {
                var newLetter = scope.selectArray[scope.rowIndex][scope.letterIndex];
                if (newLetter === 'Space') {
                    scope.selectedText += ' '
                } else if (newLetter === 'Back') {
                    scope.selectedText = scope.selectedText.substring(0, scope.selectedText.length - 1);
                } else if (newLetter === '+ Word') {
                    scope.sentence += ' ' + scope.selectedText;
                    scope.selectedText = "";
                } else {
                    scope.selectedText += newLetter
                }
            }


            function resetRight() {
                if (scope.ready && scope.rowSelect) selectRow();
                if (scope.ready && scope.letterSelect) selectLetter();
            }

            function resetBrow() {
                // scope.ready determines if user is ready to select letters by selecting row
                if (scope.ready) {
                    if (scope.rowSelect) { //if the user is still selecting the row
                        scope.rowSelect = false;
                        scope.letterSelect = true;
                        scope.rowArray[scope.rowIndex] = 0;
                        scope.styleArray[scope.rowIndex][0] = 1;
                    } else if (scope.letterSelect) { //if the user is selecting the letter
                        scope.letterInput = 'letter-success'; //changes css
                        pushLetter(); //pushes letter into input
                        scope.styleArray[scope.rowIndex][scope.letterIndex] = 0; //reset index of row and column
                        scope.letterSelect = false; //letter is not ready to select
                        scope.rowSelect = true;
                        startRow(); //reset row select
                        scope.letterIndex = 0;
                    }
                }
                setTimeout(function() {
                    scope.statusBrow = false;
                    scope.letterInput = '';
                    scope.selectBox = "";
                    scope.$digest();
                    browDebounce = true;
                }, 700)
            }



            scope.takeBase = function() {
                browZeroArray = scope.browDetails;
                takeReading();
            }



            //findZero and reset zero can be combined... used a button to manually reset zero
            scope.resetZero = function() {
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    leftZeroArray = leftArray.map(function(index) {
                        return positions[index][1]
                    });
                    rightZeroArray = rightArray.map(function(index) {
                        return positions[index][1]
                    });
                    browZeroArray = browArray.map(function(index) {
                        return positions[index][1]
                    })
                }
            }

            function findZero() {
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    scope.browDetails = browArray.map(function(index) {
                        return positions[index][1]
                    })
                    scope.$digest();
                }

            }


            function readPositions() {
                //get psoition cords
                var positions = ctracker.getCurrentPosition();
                if (positions) {
                    scope.zeroArray = BlinkFactory2.percentChange(leftZeroArray, rightZeroArray, browZeroArray, positions) //this compares current positions with Zero, returns [deltaLeft, deltaRight, deltaBrow]
                }
                //all of these < 0, element active
                scope.browThres = scope.zeroArray[2] - scope.browThreshold;

                if (scope.browThres > 0 && browDebounce) {
                    scope.selectBox = "selected-letter"; //highlights input
                    scope.statusBrow = true;
                    scope.$digest();
                    browDebounce = false
                    resetBrow();
                }
            }

            function drawLoop() {
                requestAnimationFrame(drawLoop);
                context.clearRect(0, 0, canvas.width, canvas.height);
                ctracker.draw(canvas);
            }

            //initial canvas drawing
            function positionLoop() {
                requestAnimationFrame(positionLoop);
            }

            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    video: true
                }, function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                    console.log('video load');
                    //positionLoop();
                    drawLoop();
                }, errorCallback);
            } else {
                console.log('cannot find cam');
                alert('Cannot connect')
            }

        }

    }
});