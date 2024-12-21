<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useSceneCleanup } from '../../composables/use-scene-cleanup';
import { useSceneAnimation } from '../../composables/use-scene-animation';
import { createCube } from './create-cube';
import { useCamera } from './use-camera';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvasRef = useTemplateRef('canvas');

const sizes = {
  width: 800,
  height: 600,
};

let scene: THREE.Scene | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: OrbitControls | null = null;

const { animateScene } = useSceneAnimation();

useSceneCleanup({ scene, renderer, controls });

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
  const { camera } = useCamera({ scene, mesh: cube, sizes });

  /**
   * Controls
   */
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

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
    controls,
  });
};

onMounted(() => {
  setupScene();
});

onUnmounted(() => {
  scene = null;
  renderer = null;
  controls = null;
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
