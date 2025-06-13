uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Normal
  vec3 normal = normalize(vNormal);

  // Stripes
  float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
  stripes = pow(stripes, 3.0);

  // Fresnel
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float fresnel = dot(viewDirection, normal) + 1.0;
  fresnel = pow(fresnel, 2.0);

  // Hologram
  float hologram = stripes * fresnel;
  hologram += fresnel * 1.25;

  // Final color
  gl_FragColor = vec4(1.0, 1.0, 1.0, hologram);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
