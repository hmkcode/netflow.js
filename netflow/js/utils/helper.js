function findColumnWidth(data){
    var w=[];

    for(var c = 0 ; c < data[0].length; c++)
        w[c] = 0;
    
    for(var r = 0; r < data.length; r++)
        for(var c = 0 ; c < data[r].length; c++)
            if(w[c] < textWidth(data[r][c]))
                w[c] = textWidth(data[r][c]);
    
    return w;
}

function sumMaxColumnWidth(ws){
    var sum = 0 ;
    for(var i = 0 ; i < ws.length; i++)
        sum += (ws[i] + 2 * PADDING_TEXT)
    return sum;
}

function randomValues(rows, cols){
    values = [];
    if(cols == null){
        for(var r = 0 ; r < rows; r++)
            values[r] = numFormat(Math.random());
    }
    else{
        for(var r = 0 ; r < rows; r++){
            values[r] = [];
            for(var c = 0 ; c < cols; c++)
                values[r][c] = numFormat(Math.random());
        }
    }
    return values;
}

function numFormat(value){
    return (Math.round(value *100) /100);
}