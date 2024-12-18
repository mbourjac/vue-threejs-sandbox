<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useSceneCleanup } from '@/composables/use-scene-cleanup';
import { useSceneAnimation } from '@/composables/use-scene-animation';
import { createCube } from './create-cube';

const canvasRef = useTemplateRef('canvas');

const sizes = {
  width: 800,
  height: 600,
};

let scene: THREE.Scene | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let camera: THREE.PerspectiveCamera | null = null;

const { animateScene } = useSceneAnimation();

useSceneCleanup({ scene, renderer });

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  /**
   * Scene
   */
  scene = new THREE.Scene();

  /**
   * Object
   */
  const { animateCube } = createCube(scene);

  /**
   * Camera
   */
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;

  scene.add(camera);

  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);

  /**
   * Animate
   */
  animateScene({
    scene,
    renderer,
    camera,
    tick: animateCube,
  });
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
