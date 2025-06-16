<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useThree } from '@/composables/use-three';
import * as THREE from 'three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  rendererParameters: {
    antialias: true,
  },
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Camera
     */
    camera.position.set(1.5, 0, 6);
    camera.fov = 25;
    camera.updateProjectionMatrix();

    /**
     * Fireworks
     */
    const createFirework = (pointsCount: number, position: THREE.Vector3) => {
      // Geometry
      const positionsArray = new Float32Array(pointsCount * 3);

      for (let i = 0; i < pointsCount; i++) {
        const i3 = i * 3;

        positionsArray[i3] = Math.random() - 0.5;
        positionsArray[i3 + 1] = Math.random() - 0.5;
        positionsArray[i3 + 2] = Math.random() - 0.5;
      }

      const geometry = new THREE.BufferGeometry();

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positionsArray, 3)
      );

      // Material
      const material = new THREE.PointsMaterial();

      // Points
      const firework = new THREE.Points(geometry, material);

      firework.position.copy(position);
      scene.add(firework);
    };

    createFirework(100, new THREE.Vector3());

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
