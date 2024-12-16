<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useSceneCleanup } from '@/composables/use-scene-cleanup';
import { useAxesHelper } from '../composables/use-axes-helper';

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
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = 0.7;
  mesh.position.y = -0.6;
  mesh.position.z = 1;

  mesh.scale.x = 2;
  mesh.scale.y = 0.25;
  mesh.scale.z = 0.5;

  mesh.rotation.x = Math.PI * 0.25;
  mesh.rotation.y = Math.PI * 0.25;

  scene.add(mesh);

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
