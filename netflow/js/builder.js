function build(){
    var net = new Net();

    net.addLayer(2);

    net.addLayer(2);
    net.addLayer(1);
  


    net.setInputValues([2,3])
    net.setOutputValues([1])

    net.weights[0].setValues([[.11, .12],[.21, .08]])
    net.weights[1].setValues([[.14],[.15]])

    // net.training = {
    //         "inputs": [ [-4,3] , [2,5] , [1,3]],
    //         "outputs":[[1], [2], [3]]
    // }

    return net;

}