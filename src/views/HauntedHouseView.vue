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
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);

    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5);

    directionalLight.position.set(3, 2, -8);

    scene.add(directionalLight);

    /**
     * Object
     */
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ roughness: 0.7 })
    );
    scene.add(sphere);

    /**
     * Camera
     */
    camera.position.x = 4;
    camera.position.y = 2;
    camera.position.z = 5;

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
