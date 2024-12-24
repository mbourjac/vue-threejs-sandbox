<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useScene } from '@/composables/use-scene';
import { useAnimateScene } from '@/composables/use-animate-scene';
import { useOrbitControls } from '@/composables/use-orbit-controls';

const canvasRef = useTemplateRef('canvas');

const sizes = {
  width: 800,
  height: 600,
};

const { scene, setupRenderer } = useScene();
const { animate } = useAnimateScene();
const { setupOrbitControls } = useOrbitControls();

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  // Object
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

  camera.position.z = 3;
  scene.add(camera);

  // Controls
  const { controls } = setupOrbitControls(camera, canvas);

  // Renderer
  const { renderer } = setupRenderer(canvas, sizes);

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
