function loadText(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType("text/plain");
    xhr.send(null);
    if(xhr.status === 200)
        return xhr.responseText;
    else {
        return null;
    }
}

var rotate = {x: 0, y: 0, z: 0};
var translate = {x: 0, y: 0, z: 0};
var scale = 1;
var fov = 45;

var initDemo = function() {
  //console.log("This is working");

  var canvas = document.getElementById('canvas-surface');
  var gl = canvas.getContext('webgl');

  if (!gl) {
    console.log('WebGL not supported, falling back on experimental-WebGL');
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    alert('Your browser does not support WebGL');
  }

  // RESPONSIVE CONFIG
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  // CUBE TEXTURE
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  // INIT
  var vertexShaderSource = loadText("gl/vertex.glsl");
  var fragmentShaderSource = loadText("gl/fragment.glsl");

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.shaderSource(fragmentShader, fragmentShaderSource);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("Error Compilation Vertex Shader: ", gl.getShaderInfoLog(vertexShader));
      return;
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Error Compilation Fragment Shader: ", gl.getShaderInfoLog(fragmentShader));
      return;
  }

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Error Linking Shader: ", gl.getProgramInfoLog(program));
      return;
  }

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Error Validating Program: ", gl.getProgramInfoLog(program));
      return;
  }

  //
	// Create buffer
	//
	var boxVertices =
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    0.18, 0.77, 0.43,
		1.0, -1.0, 1.0,    0.18, 0.77, 0.43,
		-1.0, -1.0, 1.0,    0.18, 0.77, 0.43,
		-1.0, 1.0, 1.0,    0.18, 0.77, 0.43,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

  var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

  var positionAttribLocation = gl.getAttribLocation(program, 'vPosition');
  var colorAttribLocation = gl.getAttribLocation(program, 'vColor');

  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute Location
    3,
    gl.FLOAT,
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0
  );

  gl.vertexAttribPointer(
    colorAttribLocation, // Attribute Location
    3,
    gl.FLOAT,
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  gl.useProgram(program);

  // MOUSE EVENT
  canvas.addEventListener('wheel', function (e) {
      min = 0.1;
      max = 5;
      scaleStep = 0.05;

      if (e.deltaY > 0) {
        scale = Math.min(scale + scaleStep, max);
      } else {
        scale = Math.max(scale - scaleStep, min);
      }

      scaleRange.value = zoom.innerHTML = scale.toFixed(2);

      e.preventDefault();
  });

  canvas.addEventListener('mousedown', function () {
      mousePressed = true;
  });

  canvas.addEventListener('mouseup', function () {
      mousePressed = false;
  });

  canvas.addEventListener('mouseleave', function () {
      mousePressed = false;
  });

  canvas.addEventListener('mousemove', function (e) {
      if (!mousePressed) {
          return;
      }

      rotate.x -= (event.movementY / 100);
      rotate.x = rotate.x - 2 * Math.PI * Math.floor((rotate.x + Math.PI) / (2 * Math.PI));
      rotate.x = rotate.x.toFixed(2);
      xRotate.value = panelRotation.x.innerHTML = rotate.x;

      rotate.y -= (event.movementX / 100);
      rotate.y = rotate.y - 2 * Math.PI * Math.floor((rotate.y + Math.PI) / (2 * Math.PI));
      rotate.y = rotate.y.toFixed(2);
      yRotate.value = panelRotation.y.innerHTML = rotate.y;
  });

  // SCENE INIT
  var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
  var matViewUniformLocation = gl.getUniformLocation(program, "mView");
  var matProjUniformLocation = gl.getUniformLocation(program, "mProj");
  var matScaleUniformLocation = gl.getUniformLocation(program, "mScale");

  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  var scaleMatrix = new Float32Array(16);

  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
  mat4.perspective(projMatrix, glMatrix.toRadian(fov), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
  gl.uniformMatrix4fv(matScaleUniformLocation, gl.FALSE, scaleMatrix);

  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);
  var zRotationMatrix = new Float32Array(16);

  var identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);

  // RENDER
  var loop = function() {


    // TRANSLATION
    var translationObjectMat = mat4.create();
    var translationObjectValue = mat4.fromValues(translate.x, translate.y, translate.z - 10);
    mat4.fromTranslation(translationObjectMat, translationObjectValue);
    gl.uniformMatrix4fv(matViewUniformLocation, false, translationObjectMat);

    // ROTATION
    var rotationObjectMat = mat4.create();
    mat4.rotateX(rotationObjectMat, rotationObjectMat, rotate.x);
    mat4.rotateY(rotationObjectMat, rotationObjectMat, rotate.y);
    mat4.rotateZ(rotationObjectMat, rotationObjectMat, rotate.z);
    gl.uniformMatrix4fv(matWorldUniformLocation, false, rotationObjectMat);

    // SCALING
    var scalingObjectMat = mat4.create();
    var scalingObjectValue = mat4.fromValues(scale, scale, scale, 1);
    mat4.fromScaling(scalingObjectMat, scalingObjectValue);
    gl.uniformMatrix4fv(matScaleUniformLocation, false, scalingObjectMat);

    // FOV
    fovRange.addEventListener('input', function () {
        fov = this.value;
        mat4.perspective(projMatrix, glMatrix.toRadian(fov), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    });

    // EXEC CUBE
    gl.clearColor(0.4, 0.46, 0.49, 1.0); // Scene color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Apply
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0); // Draw

    requestAnimationFrame(loop);
  }

  // RESIZE RESPONSIVE
  window.addEventListener('resize', function() {
    mat4.perspective(projMatrix, glMatrix.toRadian(fov), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
  });

  requestAnimationFrame(loop);
};
