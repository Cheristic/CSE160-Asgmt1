class Quadrilateral{
    constructor(position, color, width, height) {
      this.type='quadrilateral';
      this.position = position;
      this.color = color;
      this.width = width;
      this.height = height;
    }
  
    render() {
      var xy = this.position;
      var rgba = this.color;
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Draw
      let width = this.width/200;
      let height = this.height/200;
      drawQuad([xy[0], xy[1], xy[0], xy[1]+height, xy[0]+width, xy[1], xy[0]+width, xy[1]+height]);  
    }
}

function drawQuad(vertices) {
  var n = 4;

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
  