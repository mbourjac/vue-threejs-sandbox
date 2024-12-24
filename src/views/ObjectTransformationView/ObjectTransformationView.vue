<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { useAxesHelper } from '../../composables/use-axes-helper';
import { useCubesGroup } from './use-cubes-group';
import { useScene } from '@/composables/use-scene';
import { useCamera } from './use-camera';

const canvasRef = useTemplateRef('canvas');

const width = ref(800);
const height = ref(600);

const { scene, setupRenderer } = useScene();

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  // Axes Helper
  useAxesHelper(scene, 2);

  // Objects
  useCubesGroup(scene);

  // Camera
  const { camera } = useCamera(scene, { width, height });

  // Renderer
  const { renderer } = setupRenderer(canvas, { width, height });
  renderer.render(scene, camera);
};

onMounted(() => {
  setupScene();
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
