exports.remove = function(array, element) {
    for(var i = array.length - 1; i >= 0; i--) {
        if(array[i] === element) {
            array.splice(i, 1);
        }
    }
} 