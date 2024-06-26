class Point{
    constructor(position, color, size) {
      this.type='point';
      this.position = position;
      this.color = color;
      this.size = size;
      this.width = size;
      this.height = size;
      this.rotationMatrix = new Matrix4()
    }
  
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;

      // Quit using the buffer to send the attribute
      gl.disableVertexAttribArray(a_Position);
  
      // Pass the position of a point to a_Position variable
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      // Pass the size of a point to a_PointSize
      gl.uniform1f(u_PointSize, size);
      // Pass the rotation to u_xformMatrix
      gl.uniformMatrix4fv(u_xformMatrix, false, this.rotationMatrix.elements);
      // Draw
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }