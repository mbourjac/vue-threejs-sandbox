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
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 5000;

    const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

    for (
      let i = 0;
      i < count * 3;
      i++ // Multiply by 3 for same reason
    ) {
      positions[i] = (Math.random() - 0.5) * 10; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    ); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true,
    });

    particlesMaterial.size = 0.1;

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
