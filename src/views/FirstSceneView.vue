<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useScene } from '@/composables/use-scene';

const canvasRef = useTemplateRef('canvas');

const sizes = {
  width: 800,
  height: 600,
};

const { scene, setupRenderer } = useScene();

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

  // Renderer
  const { renderer } = setupRenderer(canvas, sizes);
  renderer.render(scene, camera);
};

onMounted(() => {
  setupScene();
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
