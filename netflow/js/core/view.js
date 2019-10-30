function Button(){
    this.x = 10;
    this.y = 10; 
    this.width = 150;
    this.height = 30;
    this.isPlaying = false;
    this.direction = "FORWARD";
    

    this.clicked = function(x, y){
       
        if(x >= this.x && x <= this.x+this.width && y >= this.y && y <= this.y+this.height)
            return true;
        else
            return false;

    }

    this.switchPlay = function(isPlaying){
        this.isPlaying = isPlaying;
        this.draw();
    }
    this.switchDirection = function(direction){
        this.direction = direction;
        this.draw();
    }

    this.draw = function(){
        drawPlayButton((this.isPlaying?"PAUSE":"PLAY")+" "+this.direction, this.isPlaying, 
            this.x, this.y, this.width, this.height)
    }
}