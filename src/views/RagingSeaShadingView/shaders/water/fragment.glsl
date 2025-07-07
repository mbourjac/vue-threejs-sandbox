#include ../../../../utils/glsl/directional-light.glsl

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);

  // Base color
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  mixStrength = smoothstep(0.0, 1.0, mixStrength);
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

  // Light
  vec3 light = vec3(0.0);

  light += directionalLight(vec3(1.0), 1.0, normal, vec3(-1.0, 0.5, 0.0), viewDirection, 30.0);

  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}
