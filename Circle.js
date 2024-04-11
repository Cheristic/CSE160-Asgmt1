class Circle{
    constructor(position, color, size, segments) {
      this.type='circle';
      this.position = position;
      this.color = color;
      this.size = size;
      this.segments = segments;
      this.width = size;
      this.height = size;
      this.rotationMatrix = new Matrix4()
    }
  
    render() {
      var xy = this.position;
      var rgba = this.color;

      // Pass the rotation to u_xformMatrix
      gl.uniformMatrix4fv(u_xformMatrix, false, this.rotationMatrix.elements);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


      var d = this.size/360.0; // delta
      let angleStep = 360/this.segments;
      let centerPt = [xy[0], xy[1]];
      for (var angle = 0; angle < 360; angle+=angleStep) {
        let angle1=angle;
        let angle2=angle+angleStep;
        let vec1=[Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
        let vec2=[Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
        let pt1 = [vec1[0] + centerPt[0], vec1[1] + centerPt[1]];
        let pt2 = [vec2[0] + centerPt[0], vec2[1] + centerPt[1]];
        drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
      }
    }
  }