#include ../../../../utils/glsl/ambient-light.glsl

uniform vec3 uColor;

void main() {
  vec3 color = uColor;

  // Lights
  vec3 light = vec3(0.0);
  light += ambientLight(vec3(1.0), 0.03);
  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
