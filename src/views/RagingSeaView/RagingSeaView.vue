<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Water
     */
    // Geometry
    const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128);

    // Material
    const waterMaterial = new THREE.MeshBasicMaterial();

    // Mesh
    const water = new THREE.Mesh(waterGeometry, waterMaterial);

    water.rotation.x = -Math.PI * 0.5;
    scene.add(water);

    /**
     * Camera
     */
    camera.position.set(1, 1, 1);

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
