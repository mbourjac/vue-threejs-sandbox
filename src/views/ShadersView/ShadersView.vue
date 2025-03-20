<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Object
     */
    // Geometry
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    const count = geometry.attributes.position.count;
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }

    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    // Material
    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
    });

    // Mesh
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
