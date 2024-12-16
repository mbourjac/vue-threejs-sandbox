<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useSceneCleanup } from '@/composables/use-scene-cleanup';
import { useAxesHelper } from '../../composables/use-axes-helper';
import { createBox } from './create-box';

const canvasRef = useTemplateRef('canvas');

const sizes = {
  width: 800,
  height: 600,
};

let scene: THREE.Scene | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let camera: THREE.PerspectiveCamera | null = null;

useSceneCleanup({ scene, renderer });

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  /**
   * Scene
   */
  scene = new THREE.Scene();

  /**
   * Axes Helper
   */
  useAxesHelper(scene, 2);

  /**
   * Object
   */
  const { mesh } = createBox(scene);

  /**
   * Camera
   */
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  camera.lookAt(mesh.position);

  scene.add(camera);

  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
};

onMounted(() => {
  setupScene();
});

onUnmounted(() => {
  scene = null;
  renderer = null;
  camera = null;
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
