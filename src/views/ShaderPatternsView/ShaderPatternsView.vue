<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import vertexShader from './shaders/random-grid/vertex.glsl';
import fragmentShader from './shaders/random-grid/fragment.glsl';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Object
     */
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    /**
     * Camera
     */
    camera.position.set(0.25, -0.25, 1);

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
