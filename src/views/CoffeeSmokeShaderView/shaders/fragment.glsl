uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main() {
  // Scale and animation
  vec2 smokeUv = vUv;
  smokeUv.x *= 0.5;
  smokeUv.y *= 0.3;
  smokeUv.y -= uTime * 0.03;

  // Smoke
  float smoke = texture(uPerlinTexture, smokeUv).r;

  // Final color
  gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
