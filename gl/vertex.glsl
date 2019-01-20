precision mediump float;

attribute vec3 vPosition;
attribute vec3 vColor;

varying vec3 fragColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mScale;

void main () {
  fragColor = vColor;
  gl_Position =  mProj * mView * mWorld * mScale * vec4(vPosition, 1.0);
}
