#include ../../../../utils/glsl/simplex-noise-4d.glsl

void main() {
  // Wobble
  float wobble = simplexNoise4d(vec4(csm_Position, 0.0));

  csm_Position += wobble * normal;
}
