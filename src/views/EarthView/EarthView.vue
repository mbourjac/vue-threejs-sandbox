<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import earthVertexShader from './shaders/earth/vertex.glsl';
import earthFragmentShader from './shaders/earth/fragment.glsl';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  rendererParameters: {
    antialias: true,
  },
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Renderer
     */
    renderer.setClearColor('#000011');

    /**
     * Camera
     */
    camera.position.x = 12;
    camera.position.y = 5;
    camera.position.z = 4;

    camera.fov = 25;
    camera.updateProjectionMatrix();

    /**
     * Earth
     */
    // Mesh
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthMaterial = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
        earth.rotation.y = elapsedTime * 0.1;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
