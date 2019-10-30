var net;
var ref;
var playButton;

var SELECTED_LAYER = null;
var SELECTED_NEURON = null;


var LAYER_INDEX = 0 ;
var NEURON_INDEX = 0;
var HIGHLIGHTED_NEURON = null;
var PLAY = false;
var DIRECTION = "FORWARD"
var LEARNING_RATE = 0.05;
var SAMPLE_INDEX = 0;
function windowResized() {
    setDimes()
    resizeCanvas(_WIDTH, _HEIGHT);
    reDraw();
}

function setup() { 
    setDimes()
    canvas = createCanvas(_WIDTH, _HEIGHT);
    canvas.id("canvas");
    ref = document.getElementById("canvas");
    playButton = new Button();
    net = build();

    ref.addEventListener("click", function(){   
        clickEventListener(event.pageX,event.pageY);
    })
  } 


  function Net(){
    this.layers = [];
    this.outputLayer;
    this.errorLayer;
    this.weights = [];
    this.size = 0;
    this.x = 0;
    this.width = 0;
    this.training = null;

    this.addLayer = function (n){
        
        var layer = new Layer(n);
        layer.type = "OUTPUT";
        if(this.size == 0)
            layer.type = "INPUT";
        else if(this.size > 1)
            this.layers[this.size-1].type = "HIDDEN";           
        
           
        this.layers[this.size++] = layer
        
        if(this.size == 1)
            this.setInputValues(randomValues(layer.size, null));

        else if(this.size > 1){
            
            // error layer
            this.errorLayer = new Layer(this.layers[this.size-1].size);
            this.errorLayer.type = "ERROR"
            

            // actula layer
            this.outputLayer = new Layer(this.layers[this.size-1].size);
            this.outputLayer.type = "ACTUAL"
            this.setOutputValues(randomValues(this.outputLayer.size, null));

            weight = new Weight();
            weight.rows = this.layers[this.size-2].size;
            weight.columns = this.layers[this.size-1].size;
            weight.values = randomValues(weight.rows, weight.columns);
            this.weights[this.size-2] = weight;
        }
        ref.addEventListener("click", function(){        
            layer.onSelected(event.pageX,event.pageY) 
        })        
    }

    this.init = function(){
        this.x = (width/2 - (LAYER_WIDTH * (this.size*2-1))/2)
        this.width = (width/2 + (LAYER_WIDTH * (this.size*2-1))/2)
    }

    this.draw = function(){
        this.init()

        for(var i = 0 ; i < this.size; i++){
            this.layers[i].draw(this.x+LAYER_WIDTH*(i*2), 0)
            if(i > 0) {

                drawLines(this.layers[i-1], this.layers[i])
                drawWeights(this.weights[i-1], this.layers[i-1], this.layers[i], i)

            }                 
        } 
        // DRAW ERRPR LAYER
        this.errorLayer.draw(this.x+LAYER_WIDTH*(i*2 -1), 0);
        // DRAW ACTUAL VALUES
        this.outputLayer.draw(this.x+LAYER_WIDTH*(i*2), 0)

    }

    this.setInputValues = function(inputs){
        if(inputs == null)
            return;
        min = this.layers[0].size > inputs.length?inputs.length:this.layers[0].size ;
        for(var i = 0 ; i < min; i++)
            this.layers[0].neurons[i].value = inputs[i];

    }

    this.setOutputValues = function(output){
        if(output == null)
            return;
        
        min = this.outputLayer.size > output.length?output.length:this.outputLayer.size ;
        for(var i = 0 ; i < min; i++)
            this.outputLayer.neurons[i].value = output[i];

    }

    this.setLayerValue = function(layer, values){
        if(value == null)
            return;
        min = layer.size > values.length ? values.length : layer.size;
        for(var i = 0 ; i < min; i++)
            layer[0].neurons[i].value = values[i];
    }

    this.nextSample = function(){

        if(this.training != null){

            this.setInputValues(this.training.inputs[SAMPLE_INDEX]);
            this.setOutputValues(this.training.outputs[SAMPLE_INDEX]);

            SAMPLE_INDEX++;
            if(SAMPLE_INDEX >= this.training.inputs.length)
                SAMPLE_INDEX = 0;
        }
    }

    this.forward = function (){

        var sum = 0;
        for(var n = 0 ; n < this.layers[LAYER_INDEX].neurons.length;n++)
            sum += this.layers[LAYER_INDEX].neurons[n].value  * this.weights[LAYER_INDEX].values[n][NEURON_INDEX];

        this.layers[LAYER_INDEX+1].neurons[NEURON_INDEX].value = Math.round(sum * 100) / 100;
        
        this.layers[LAYER_INDEX+1].neurons[NEURON_INDEX].highlight();
        
        if(NEURON_INDEX + 1 < this.layers[LAYER_INDEX+1].neurons.length)
            NEURON_INDEX++;
        else{
            NEURON_INDEX = 0;
            LAYER_INDEX++;
        }
    }

    this.backpropagate = function (){

        
        this.weights[LAYER_INDEX].oldValues = []
        for(var r = 0 ; r < this.weights[LAYER_INDEX].rows; r++){
            this.weights[LAYER_INDEX].oldValues[r] = []
            for(var c = 0; c < this.weights[LAYER_INDEX].columns; c++){
                this.weights[LAYER_INDEX].oldValues[r][c] = this.weights[LAYER_INDEX].values[r][c] ;
               
                this.weights[LAYER_INDEX].values[r][c] = numFormat(this.weights[LAYER_INDEX].oldValues[r][c] - 
                            (LEARNING_RATE*this.layers[LAYER_INDEX].neurons[r].getValue()*this.partial(LAYER_INDEX, r, c)) );
                    
            }
        }
        this.weights[LAYER_INDEX].highlighted = true;
        LAYER_INDEX--;

    }

    this.partial = function(wl, r ,c){
        var gradient = 0
        if(wl+1 < this.weights.length){
            for(var i = 0; i < this.weights[wl+1].columns;i++){               
                gradient += this.layers[wl+1].neurons[c].getDefValue() * this.weights[wl+1].oldValues[c][i] * this.partial(wl+1, c, i)
            }
        }else
            return this.errorLayer.neurons[c].value;
        
        return gradient;
    }

    this.calculateError = function(){
        for(var i = 0; i < this.errorLayer.size; i++)
            this.errorLayer.neurons[i].value = numFormat(this.layers[this.size-1].neurons[i].value - this.outputLayer.neurons[i].value);
    }

    this.clearLayers = function(){

        for(var i = 1 ; i < this.layers.length; i++)
            this.layers[i].clear();
        this.errorLayer.clear();

    }
}

function Layer(n, activation){ 
    
    this.neurons = [];
    this.size = 0;
    this.y = 0;
    this.x = 0;
    this.width = 0;
    this.height = 0;
    this.type = null;
    this.selected = false;
    this.activation = (activation == null)?f:activation;

    this.addNeuron = function (neuron){        
        this.neurons[this.size++] = neuron;
    }

    this.init = function(x,y){
        this.x = x 
        this.y = (height/2 - (NEURON_DIAMETER * (this.size)))
        this.width = LAYER_WIDTH;
        this.height = NEURON_DIAMETER*2*this.size;
    }

    this.draw = function(x, y){

        this.init(x,y)

        // draw layer box
        drawLayer(this.x, this.y, this.width, this.height, this.selected, this.type)
        
        // draw neurons
        for(var i = 0 ; i < this.size; i++)
            this.neurons[i].draw(x+NEURON_DIAMETER, this.y+NEURON_DIAMETER*2*i+NEURON_DIAMETER, this.type)   
                       
    }

    this.onSelected = function(x,y){
        
        if(x >= this.x && x <= this.x+this.width && y >= this.y && y <= this.y + this.height){
            this.selected = true;                
            SELECTED_LAYER = this;
            for(var i = 0 ; i < this.size; i++)
                this.neurons[i].onSelected(x,y)
          
            
            return true;
        }  
        else
            return false;
    }
    this.clear = function(){
        for(var i = 0 ; i < this.size; i++)
            this.neurons[i].value = null;
    }

    for(var i = 0; i < n ; i++)
        this.addNeuron(new Neuron(this.activation))
}


function Neuron(activation){
    this.value = null;
    this.x = 0;
    this.y = 0;
    this.selected = false;
    this.highlighted = false;
    this.type = "NONE";
    this.activation = activation;

    this.setValue = function(value){
        this.value = value;
    }

    this.getValue = function(){
        return this.activation(this.value);
    }
    
    this.getDefValue = function(){
        return this.activation(this.value, true);
    }
    this.init = function(x,y){
        this.x = x;
        this.y = y;
    }

    this.draw = function(x, y, type){
        
        this.init(x,y)

        drawNeuron(this.x, this.y, this.selected || this.highlighted, type)
        drawNeuronValue(this.getValue(),this.x, this.y, type)
    }

    this.onSelected = function(x,y){
        var d = dist(x,y, this.x,this.y)
        if(d <= NEURON_RADIUS){
            this.selected = true;
            SELECTED_NEURON = this;
        }
    }

    this.highlight = function(){
        this.highlighted = true;
        HIGHLIGHTED_NEURON = this;
    }
}

// WEIGHT

function Weight(){
   
    this.rows;
    this.columns;
    this.values;
    this.cellsWidth = [];
    this.cellHeight;
    this.width;
    this.highlighted = false;
    this.oldValues;
  
    this.setValues = function(values){

       
        var minRows = 0 ;
        var minCols = 0;
        if(values != null){
           
            minRows = this.values.length > values.length?values.length:this.values.length;
            if(values[0] != null)
                var minCols = this.values[0].length > values[0].length?values[0].length:this.values[0].length;
        }
        
        for(var r = 0; r < minRows; r++)
            for(var c = 0 ; c < minCols; c++)
                    this.values[r][c] = numFormat(values[r][c]);
      
        
    }

    this.init = function(){
        this.cellsWidth = findColumnWidth(this.values);
        this.cellHeight = textAscent("0123456789");
        this.width = sumMaxColumnWidth(this.cellsWidth);
    }
    this.draw = function(x, y, rightLayerIndex){       
        this.init();
        
        if(rightLayerIndex%2 == 0)
            y = y - this.values.length*(this.cellHeight+2*PADDING_TEXT)
        else
            y = y + this.cellHeight+2*PADDING_TEXT;

        for(var r = 0 ; r < this.values.length; r++)       
            this.drawRow(this.values[r], x - this.width/2,
                y+r*(this.cellHeight+2*PADDING_TEXT),
                this.cellsWidth,
                this.cellHeight, 
                rightLayerIndex);
    }

    this.drawRow = function(rdata, x, y, w, h, rightLayerIndex){
        for(var i = 0 ; i < rdata.length; i++){
            x += (w[i] + 2*PADDING_TEXT)/2

            var selected = net.layers[rightLayerIndex].neurons[i].selected ||
                net.layers[rightLayerIndex].neurons[i].highlighted ||
                this.highlighted;
            if(selected)
                drawCellBox(x - (w[i]/2 + PADDING_TEXT), 
                            y - (h/2 + PADDING_TEXT),
                            w[i]+2*PADDING_TEXT, 
                            h+2*PADDING_TEXT)
            drawCellValue(rdata[i], x , y, selected)

            x += (w[i] + 2*PADDING_TEXT)/2
        }

    }

}

// ACTION & EVENTS
//================

function draw() {   
    net.draw();
    playButton.draw()
    noLoop();
   
  }

  
// REDRAW
function reDraw(){
    console.log("redraw...")
    clear();
    playButton.draw()
    net.draw();
    clearSelection();     
}

function mouseWheel(event) {       
    scale = 0;
    if(event.delta > 0)
        scale = 2;
    else    
        scale = -2;
    if(NEURON_DIAMETER + scale > 10){
        NEURON_DIAMETER += scale;
        TEXT_SIZE += scale * 0.25;
        PADDING_TEXT += scale * 0.25;
    }
    else
        return;
   
    setDimes();
    reDraw();
}

function keyPressed(){
    if(keyCode == 32)
        onPlayButtonClicked();
}

function clickEventListener(x, y){
    if(playButton.clicked(x, y))
        onPlayButtonClicked();
    else{
    for(var l = 0 ; l < net.size; l++)
            if(net.layers[l].onSelected())                
                break;
        reDraw();
    }
}

function onPlayButtonClicked(){
    PLAY = !PLAY;
    playButton.switchPlay(PLAY);            
    if(PLAY && DIRECTION == "FORWARD")
        playForward();
    else if(PLAY && DIRECTION == "BACKPROPAGATE")
        playBackward();
    else
        pause();
}


function playForward(){
    if(LAYER_INDEX < net.layers.length-1){
        if(PLAY){
            net.forward();
            reDraw();
            setTimeout(function(){                   
                playForward();            
            }, DELAY)
        }else
            pause();
    }else{
        PLAY = false;
        DIRECTION = "BACKPROPAGATE";
        playButton.switchPlay(PLAY);
        playButton.switchDirection(DIRECTION);

        net.calculateError();
        LAYER_INDEX--;
        pause();
        
    }
  }

  function playBackward(){
    if(LAYER_INDEX >= 0){
        if(PLAY){
            net.backpropagate();
            reDraw();
            net.weights[LAYER_INDEX+1].highlighted = false;
            setTimeout(function(){                   
                playBackward();            
            }, DELAY)
        }else
            pause();
    }else{
        PLAY = false;
        DIRECTION = "FORWARD";
        playButton.switchPlay(PLAY);
        playButton.switchDirection(DIRECTION);
        LAYER_INDEX = 0;
        
        net.clearLayers();
        pause();
        
    }
  }

  function pause(){        
        reDraw();  
        setTimeout(function(){                            
        }, DELAY)
    }


  function clearSelection(){
    if(SELECTED_LAYER != null){
        SELECTED_LAYER.selected = false;
        SELECTED_LAYER = null;
    }
    if(SELECTED_NEURON != null){
        SELECTED_NEURON.selected = false;
        SELECTED_NEURON = null;
    }
    if(HIGHLIGHTED_NEURON != null){
        HIGHLIGHTED_NEURON.highlighted = false;
        HIGHLIGHTED_NEURON = null;
    }
  }
  
 
