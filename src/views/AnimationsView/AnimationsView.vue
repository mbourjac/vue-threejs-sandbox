<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useSceneCleanup } from '@/composables/use-scene-cleanup';
import { useSceneAnimation } from '@/composables/use-scene-animation';
import { createCube } from './create-cube';
import { createCamera } from './create-camera';

const canvasRef = useTemplateRef('canvas');

const sizes = {
  width: 800,
  height: 600,
};

let scene: THREE.Scene | null = null;
let renderer: THREE.WebGLRenderer | null = null;

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
  const { cube } = createCube(scene);

  /**
   * Camera
   */
  const { camera, animateCamera } = createCamera(scene, sizes);

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
    tick: (elapsedTime) => {
      animateCamera(elapsedTime, cube);
    },
  });
};

onMounted(() => {
  setupScene();
});

onUnmounted(() => {
  scene = null;
  renderer = null;
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
