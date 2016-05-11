core.factory('CornersFactory', function() {
    let boxes = {

    }
    let TLBox = {
    	type: 'letters',
    	contents: ["A", "B", "C", "D", "E", ""]
    };
    let TMBox = {
    	type: 'blank',
    	contents: ''
    };
    let MLBox = {
    	type: 'blank',
    	contents: ''
    };
    let MRBox = {
    	type: 'blank',
    	contents: ''
    };
    let BMBox = {
    	type: 'blank',
    	contents: ''
    };
    let MMBox = {
    	type: 'middle',
    	contents: 'Look Here'
    };
    //let MMBox = ["K", "L", "M", "N", "O", ""];

    let TRBox = {
    	type: 'letters',
    	contents: ["F", "G", "H", "I", "J", ""]
    };
    
    let BLBox = {
    	type: 'letters',
    	contents: ["P", "Q", "R", "S", "T", ""]
    };

    let BRBox = {
    	type: 'letters',
    	contents: ["U", "V", "W", "X", "Y", "Z"]
    };

    return {
        getPosition: () => {

        },
        getBoxes: () => {
        	return [TLBox, TMBox, TRBox, MLBox, MMBox, MRBox, BLBox, BMBox, BRBox]
        }
    }
});