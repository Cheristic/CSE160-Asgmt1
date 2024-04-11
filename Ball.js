class Ball extends Circle{
  
  constructor() {
      super();
      this.type = "ball"
      this.speed = 15;
      this.direction = [(Math.random()-.5)*2, (Math.random())*.1 - 1];
      this.BOUNDS = 1;

      this.dirBool = [false, false];
  }

  update() {
    let ballPrevPos = this.position;

    this.position[0] = this.position[0] + (this.direction[0] * dt);

    let detected = [0, 0]; // collision direction: 0 = none, -1 = left/up, 1 = right/down
    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
      let shape = g_shapesList[i];
      if (shape.type == "ball") continue;

      if (shape.position[0] + shape.width/400 >= this.position[0] - this.size/200 &&
          shape.position[0] - shape.width/400 <= this.position[0] + this.size/200 &&
          shape.position[1] + shape.height/400 >= this.position[1] - this.size/200 &&
          shape.position[1] - shape.height/400 <= this.position[1] + this.size/200) {
            // collision detected, return direction
            let xdiff = shape.position[0] - this.position[0];
            let ydiff = shape.position[1] - this.position[1];
            if (xdiff >= ydiff) {
              if (shape.position[0] < this.position[0]) {detected[0] = -1; ;}
              else if (shape.position[0] > this.position[0]) {detected[0] = 1; }
            } else {
              if (shape.position[1] < this.position[1]) {detected[1] = 1; }
              else if (shape.position[1] > this.position[1]) {detected[1] = -1; }
            }
               

            break;
      }
    }

    // reset dirBool once its outside the colliders range
    if (detected[0] == 0) {this.dirBool[0] = false;}
    if (detected[1] == 0) {this.dirBool[1] = false;}




    if (detected[0] == -1 && this.dirBool[0] == false || this.position[0] < -this.BOUNDS) { // hit left, bounce to right
      if (this.position[0] < -this.BOUNDS) this.size = 0;
      else { this.dirBool[0] = true;console.log("going right"); }
      this.direction[0] = -this.direction[0];
      
    } 
    else if (detected[0] == 1 && this.dirBool[0] == false || this.position[0] > this.BOUNDS) { // hit right, bounce to left
       if(this.position[0] > this.BOUNDS) this.size = 0;
       else { this.dirBool[0] = true; console.log("going left");}
      this.direction[0] = -this.direction[0];
      
    }

    // update y position
    this.position[1] = this.position[1] + (this.direction[1] * dt);

    if (detected[1] == -1 && this.dirBool[1] == false || this.position[1] < -this.BOUNDS) { // hit up, bounce downwards
      if(this.position[1] < -this.BOUNDS) this.size = 0;
      else { this.dirBool[1] = true; console.log("going downward");}
      this.direction[1] = -this.direction[1];
      
    } 
    else if (detected[1] == 1 && this.dirBool[1] == false || this.position[1] > this.BOUNDS) { // hit down, bounce upwards
      if (this.position[1] > this.BOUNDS) this.size = 0;
      else { this.dirBool[1] = true; console.log("going upwards")}
      this.direction[1] = -this.direction[1];
      
    }
  }
  
}