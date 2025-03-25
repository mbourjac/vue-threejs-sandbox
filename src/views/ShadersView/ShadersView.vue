<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

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
      uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
      },
    });

    gui
      .add(material.uniforms.uFrequency.value, 'x')
      .min(0)
      .max(20)
      .step(0.01)
      .name('frequencyX');
    gui
      .add(material.uniforms.uFrequency.value, 'y')
      .min(0)
      .max(20)
      .step(0.01)
      .name('frequencyY');

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
      tick: (elapsedTime) => {
        // Update material
        material.uniforms.uTime.value = elapsedTime;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
