<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useAnimateScene } from '../composables/use-animate-scene';
import { useWindowSize } from '../composables/use-window-size';
import { useFullscreenScene } from '../composables/use-fullscreen-scene';
import { useResizeScene } from '../composables/use-resize-scene';
import { useOrbitControls } from '../composables/use-orbit-controls';
import { useScene } from '../composables/use-scene';

const canvasRef = useTemplateRef('canvas');

const { width, height, aspectRatio } = useWindowSize();
const { scene, setupRenderer } = useScene();
const { animate } = useAnimateScene();
const { setupOrbitControls } = useOrbitControls();

useFullscreenScene(canvasRef);

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  // Object
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, aspectRatio.value);

  camera.position.z = 3;
  scene.add(camera);

  // Controls
  const { controls } = setupOrbitControls(camera, canvas);

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
