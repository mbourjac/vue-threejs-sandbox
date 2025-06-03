<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useAnimateScene } from '@/composables/use-animate-scene';
import { useGui } from '@/composables/use-gui';
import { useOrbitControls } from '@/composables/use-orbit-controls';
import { useScene } from '@/composables/use-scene';
import { useSizes } from '@/composables/use-sizes';
import { useResizeScene } from '@/composables/use-resize-scene';
import galaxyVertexShader from './shaders/galaxy/vertex.glsl';
import galaxyFragmentShader from './shaders/galaxy/fragment.glsl';

const canvasRef = useTemplateRef('canvas');

const { width, height, aspectRatio } = useSizes();
const { scene, setupRenderer } = useScene();
const { animate } = useAnimateScene();
const { setupOrbitControls } = useOrbitControls();
const { gui } = useGui();

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  /**
   * Galaxy
   */
  const parameters = {
    count: 200000,
    size: 0.005,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
  };

  let geometry: THREE.BufferGeometry | null = null;
  let material: THREE.ShaderMaterial | null = null;
  let points: THREE.Points | null = null;

  const generateGalaxy = () => {
    if (!scene) return;

    // Destroy old galaxy
    if (points !== null) {
      geometry!.dispose();
      material!.dispose();
      scene.remove(points);
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count * 1);
    const randomness = new Float32Array(parameters.count * 3);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * parameters.radius;

      const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;

      positions[i3] = Math.cos(branchAngle) * radius;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = Math.sin(branchAngle) * radius;

      randomness[i3] = randomX;
      randomness[i3 + 1] = randomY;
      randomness[i3 + 2] = randomZ;

      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Scale
      scales[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute(
      'aRandomness',
      new THREE.BufferAttribute(randomness, 3)
    );
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    /**
     * Material
     */
    material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: galaxyVertexShader,
      fragmentShader: galaxyFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 20 * renderer.getPixelRatio() },
      },
    });

    /**
     * Points
     */
    points = new THREE.Points(geometry, material);
    scene.add(points);
  };

  gui
    .add(parameters, 'count')
    .min(100)
    .max(1000000)
    .step(100)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, 'size')
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, 'radius')
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, 'branches')
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, 'spin')
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, 'randomness')
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, 'randomnessPower')
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
  gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(75, aspectRatio.value);

  camera.position.z = 3;
  scene.add(camera);

  // Controls
  const controls = setupOrbitControls(camera, canvas);

  /**
   * Renderer
   */
  const { renderer } = setupRenderer(canvas, { width, height });

  /**
   * Resize
   */
  useResizeScene({ camera, renderer, sizes: { width, height } });

  /**
   * Animate
   */
  animate({
    scene,
    renderer,
    camera,
    controls,
    tick: (elapsedTime) => {
      if (!material) return;

      // Update material
      material.uniforms.uTime.value = elapsedTime;
    },
  });

  generateGalaxy();
};

onMounted(() => {
  setupScene();
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
