var PADDING_TEXT = 6;
var TEXT_SIZE = 12;
var STROKE_WIDTH = 1.2;

function restorStyle(){
    strokeWeight(STROKE_WIDTH);
    stroke('#000')
}
//LAYER STYLE
//===========

function styleLayerSelected(){
    stroke("#f7922d");
    strokeWeight(2);
    fill("#ededed");
}
function styleLayerActual(){
    stroke("#ccc");
    strokeWeight(0.15);
    fill("#fff")
}
function styleLayerError(){
    strokeWeight(0.0);
    fill("#fff")
}
function styleLayer(){
    stroke("#000000");
    strokeWeight(0.15);
    fill("#ededed")
}
//NEURON STYLE
//=============

function styleNeuron(c){
    fill(c);
    stroke(c);
    strokeWeight(STROKE_WIDTH);
}

function styleNeuronSelected(){
    styleNeuron("#f7922d");
}

function styleNeuronInput(){
    styleNeuron("#6b6b6b");
}

function styleNeuronHidden(){
    styleNeuron("#4fadff");
}

function styleNeuronOutput(){
    styleNeuron("#00d639");
}

function styleNeuronActual(){
    styleNeuron("#eee");
}

function styleNeuronError(){
    styleNeuron("#fff");
}
// TEXT STYLE
//===========
function styleNeuronValue(){
    fill("#ffffff");
    textSize(TEXT_SIZE);
    textAlign(CENTER,CENTER)
}

function styleNeuronValueActual(){
    fill("#999");
    textSize(TEXT_SIZE);
    textAlign(CENTER,CENTER)
}

function styleNeuronValueError(){
    fill("#ff0000");
    textSize(TEXT_SIZE);
    textAlign(CENTER,CENTER)
}

//LINE STYLE
//==========

function styleLineSelected(){
    stroke("#f7922d");
    strokeWeight(1.5);
}

function styleLine(){
    stroke("#cecece");
    strokeWeight(0.75);
}



// CELL
//=====

function styleCellSelected(){
    fill("#f7922d");
    stroke("#ffffff")
}

function styleCellValueSelected(){
    stroke("#f7922d")
    fill("#fff")
}

function styleCellValue(){
    fill("#000000");
    stroke("#ffffff")
}