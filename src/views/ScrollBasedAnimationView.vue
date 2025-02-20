<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  useFullScreen: true,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Objects
     */
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );

    scene.add(cube);

    /**
     * Camera
     */
    camera.fov = 35;
    camera.updateProjectionMatrix();
    camera.position.z = 6;

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      controls,
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
