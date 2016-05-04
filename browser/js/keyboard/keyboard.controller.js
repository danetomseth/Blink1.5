core.controller("keyboardCtrl", function($scope) {
    $scope.alphabet = [
        ["A", "B", "C", "D", "E", "Yes"],
        ["F", "G", "H", "I", "J", "No"],
        ["K", "L", "M", "N", "O", "*"],
        ["P", "Q", "R", "S", "T", "/"],
        ["U", "V", "W", "X", "Y", "Z"],
        ["0", "1", "2", "3", "4", "+"],
        ["5", "6", "7", "8", "9", "-"]
    ];

    let coords = [0,0]; //Current spot in alphabet array

    // Loop through the array, highlighting each letter
    let loop = function(time) {
        window.setTimeout(looper, time)
    };

    function looper() {
        $scope.current = $scope.alphabet[coords[0]][coords[1]];
        $scope.$digest();
        if (coords[1] < 5) {
            coords[1]++
        } else if (coords[0] == 6 && coords[1] === 5) {
            coords = [0,0]
        } else {
            coords[0]++
            coords[1] = 0
        }
        loop(500);
    };
    loop(500);

});
