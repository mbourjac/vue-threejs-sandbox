<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useThree } from '@/composables/use-three';
import * as THREE from 'three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  useFullScreen: true,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const textureLoader = new THREE.TextureLoader();

    /**
     * Objects
     */
    // Textures
    const doorColorTexture = textureLoader.load('./textures/door/color.jpg');

    doorColorTexture.colorSpace = THREE.SRGBColorSpace;

    // MeshBasicMaterial
    const material = new THREE.MeshBasicMaterial();

    material.map = doorColorTexture;

    // Sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      material
    );

    sphere.position.x = -1.5;

    // Plane
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

    // Torus
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 16, 32),
      material
    );

    torus.position.x = 1.5;

    scene.add(sphere, plane, torus);

    /**
     * Camera
     */
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
        // Update objects
        sphere.rotation.y = 0.1 * elapsedTime;
        plane.rotation.y = 0.1 * elapsedTime;
        torus.rotation.y = 0.1 * elapsedTime;

        sphere.rotation.x = -0.15 * elapsedTime;
        plane.rotation.x = -0.15 * elapsedTime;
        torus.rotation.x = -0.15 * elapsedTime;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
