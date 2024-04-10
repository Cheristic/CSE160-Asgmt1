class Triangle{
    constructor() {
      this.type='triangle';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0,1.0,1.0,1.0];
      this.size = 5.0;
      this.rotationMatrix = new Matrix4()
      this.triangleType = 0;
    }
  
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the rotation to u_xformMatrix
      gl.uniformMatrix4fv(u_xformMatrix, false, this.rotationMatrix.elements);

      // Draw
      var d = this.size/200.0; // delta
      if (this.triangleType == 0) { // equilateral
        drawTriangle([xy[0]-d/2, xy[1]-d/2, xy[0]+d/2, xy[1]-d/2, xy[0], xy[1]+d/2]);
      } else if (this.triangleType == 1) {
        drawTriangle([xy[0]-d/2, xy[1]+d/2, xy[0]+d/2, xy[1]+d/2, xy[0], xy[1]-d/2]);
      } else if (this.triangleType == 2) {
        drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
      } else if (this.triangleType == 3) {
        drawTriangle([xy[0], xy[1], xy[0]-d, xy[1], xy[0], xy[1]+d]);
      }
      
    }
}

function drawTriangle(vertices) {
  var n = 3;

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}
  