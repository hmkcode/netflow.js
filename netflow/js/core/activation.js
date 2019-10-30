function f(x, def){
    if(!def)
        return x;
    else
        return 1;
}

function ReLu(x, def){

    if(!def)
        return Math.max(0, x);
    else
        return (x <= 0)?0:x;
}