<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Object
     */
    const geometry = new THREE.BufferGeometry();

    // Create a Float32Array containing the vertices position
    const positionsArray = new Float32Array([
      0,
      0,
      0, // First vertex
      0,
      1,
      0, // Second vertex
      1,
      0,
      0, // Third vertex
    ]);
    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

    geometry.setAttribute('position', positionsAttribute);

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    /**
     * Camera
     */
    camera.position.z = 3;

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
