<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { useAnimateScene } from '@/composables/use-animate-scene';
import { useCube } from './use-cube';
import { useCamera } from './use-camera';
import { useScene } from '@/composables/use-scene';

const canvasRef = useTemplateRef('canvas');

const sizes = {
  width: 800,
  height: 600,
};

const { scene, setupRenderer } = useScene();
const { animate } = useAnimateScene();

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  // Object
  const { cube } = useCube(scene);

  // Camera
  const { camera, animateCamera } = useCamera(scene, sizes);

  // Renderer
  const { renderer } = setupRenderer(canvas, sizes);

  // Animate
  animate({
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
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
