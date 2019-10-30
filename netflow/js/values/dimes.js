var NEURON_DIAMETER = 36;
var LAYER_WIDTH = 0;
var NEURON_RADIUS = 0;
var MIDDLE_X = 0;  
var MIDDLE_Y = 0;
var _WIDTH = 0;
var _HEIGHT = 0;
var DELAY = 500;

function setDimes(){
    _WIDTH = windowWidth;
    _HEIGHT = windowHeight;

    if(_WIDTH < 1200)
        _WIDTH = 1200;

    LAYER_WIDTH = NEURON_DIAMETER * 2;
    NEURON_RADIUS = NEURON_DIAMETER / 2;

}