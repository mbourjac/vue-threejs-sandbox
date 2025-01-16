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

    const trianglesCount = 50;
    const verticesPosition = new Float32Array(trianglesCount * 3 * 3);

    for (let i = 0; i < trianglesCount * 3 * 3; i++) {
      verticesPosition[i] = (Math.random() - 0.5) * 4;
    }

    const positionsAttribute = new THREE.BufferAttribute(verticesPosition, 3);

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
