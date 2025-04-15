varying vec2 vUv;

void main() {
    float strength = step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(strength), 1.0);
}