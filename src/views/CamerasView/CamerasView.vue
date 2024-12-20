<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useSceneCleanup } from '../../composables/use-scene-cleanup';
import { useSceneAnimation } from '../../composables/use-scene-animation';
import { createCube } from './create-cube';
import { useNormalizedMouse } from '@/composables/use-normalized-mouse';
import { useCamera } from './use-camera';

const canvasRef = useTemplateRef('canvas');

const sizes = {
  width: 800,
  height: 600,
};

let scene: THREE.Scene | null = null;
let renderer: THREE.WebGLRenderer | null = null;

const mouse = useNormalizedMouse(sizes);
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
  const { camera } = useCamera({ scene, mesh: cube, sizes, mouse });

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
