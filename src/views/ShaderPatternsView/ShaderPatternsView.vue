<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useAnimateScene } from '../../composables/use-animate-scene';
import { useSizes } from '../../composables/use-sizes';
import { useResizeScene } from '../../composables/use-resize-scene';
import { useOrbitControls } from '../../composables/use-orbit-controls';
import { useScene } from '../../composables/use-scene';
import vertexShader from './shaders/grid-intersections/vertex.glsl';
import fragmentShader from './shaders/grid-intersections/fragment.glsl';

const canvasRef = useTemplateRef('canvas');

const { width, height, aspectRatio } = useSizes();
const { scene, setupRenderer } = useScene();
const { animate } = useAnimateScene();
const { setupOrbitControls } = useOrbitControls();

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  /**
   * Object
   */
  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, aspectRatio.value, 0.1, 100);

  camera.position.set(0.25, -0.25, 1);
  scene.add(camera);

  // Controls
  const controls = setupOrbitControls(camera, canvas);

  // Renderer
  const { renderer } = setupRenderer(canvas, { width, height });

  // Resize
  useResizeScene({ camera, renderer, sizes: { width, height } });

  // Animate
  animate({
    scene,
    renderer,
    camera,
    controls,
  });
};

onMounted(() => {
  setupScene();
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
