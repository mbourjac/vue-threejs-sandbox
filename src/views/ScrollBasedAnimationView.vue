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
     * Debug
     */
    const parameters = {
      materialColor: '#ffeded',
    };

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
    });

    // Meshes
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );

    scene.add(mesh1, mesh2, mesh3);

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3);

    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

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
