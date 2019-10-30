function drawLayer(x,y,w,h,selected, type){
    if(selected)
        styleLayerSelected();
    else if(type =="ACTUAL")
        styleLayerActual();
    else if(type =="ERROR")
        styleLayerError();
    else    
        styleLayer();
    
    rect(x, y, w, h, 3)
}
function drawNeuron(x, y, selected, type){
    if(selected)
        styleNeuronSelected();
    else{
        if(type == "INPUT")
            styleNeuronInput();
        else if(type == "OUTPUT")
            styleNeuronOutput();
        else if(type == "ACTUAL")
            styleNeuronActual();
        else if(type == "ERROR")
            styleNeuronError();
        else
            styleNeuronHidden();
        
    }
    ellipse(x, y, NEURON_DIAMETER, NEURON_DIAMETER)
}
function drawNeuronValue(s, x, y, type){
   
    if(type == "ACTUAL")
        styleNeuronValueActual();
    else if(type == "ERROR"){
       
        styleNeuronValueError();
    }
    else
        styleNeuronValue()
    text(s == null?"":s, x, y);
}
function drawLine(x1, y1, x2, y2, selected){
    if(selected)
        styleLineSelected();
    else
        styleLine();
    line(x1, y1, x2, y2)
}
function drawCellBox(x, y, w, h){
    styleCellSelected();
    rect(x, y, w, h)
}
function drawCellValue(s, x, y, selected){
    if(selected)
        styleCellValueSelected();
    else
        styleCellValue();    
    textSize(TEXT_SIZE);
    text(s, x, y);
}

function drawLines(leftLayer, rightLayer){        
    for(var f = 0 ; f < leftLayer.size; f++)
        for(var r = 0 ; r < rightLayer.size; r++)
            drawLine(leftLayer.neurons[f].x+(NEURON_RADIUS+1), leftLayer.neurons[f].y, 
                    rightLayer.neurons[r].x-(NEURON_RADIUS+1), rightLayer.neurons[r].y, 
                    (rightLayer.neurons[r].selected || rightLayer.neurons[r].highlighted ));
   
}

function drawWeights(weight, leftLayer, rightLayer, index){        
    weight.draw(leftLayer.x+NEURON_DIAMETER*3,
        leftLayer.height > rightLayer.height? 
        leftLayer.y+(index%2 == 0?0:leftLayer.height) :
        rightLayer.y+ (index%2 == 0?0:rightLayer.height), index)
   
}

function drawPlayButton(s,playing, x, y, w, h){

    if(!playing){
        stroke("#00d639")
        fill("#00d639")
        rect(x, y, w, h, 3) 
    }
   else{
        stroke("#ff0000")
        fill("#ff0000")
        rect(x, y, w, h, 3)     
   }
    fill("#fff")
    stroke("#fff")
    textAlign(CENTER,CENTER)
    textSize(12);
    text(s, x+w/2, y+h/2)
    
    
}