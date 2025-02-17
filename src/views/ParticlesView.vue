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
     * Particles
     */
    // Geometry
    const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true,
    });

    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);

    scene.add(particles);

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
