<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { useAnimateScene } from '../../composables/use-animate-scene';
import { useCube } from './use-cube';
import { useCamera } from './use-camera';
import { useOrbitControls } from '@/composables/use-orbit-controls';
import { useScene } from '@/composables/use-scene';

const canvasRef = useTemplateRef('canvas');

const width = ref(800);
const height = ref(600);

const { scene, setupRenderer } = useScene();
const { animate } = useAnimateScene();
const { setupOrbitControls } = useOrbitControls();

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  // Object
  const { cube } = useCube(scene);

  // Camera
  const { camera } = useCamera({ scene, mesh: cube, sizes: { width, height } });

  // Controls
  const controls = setupOrbitControls(camera, canvas);

  // Renderer
  const { renderer } = setupRenderer(canvas, { width, height });

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
