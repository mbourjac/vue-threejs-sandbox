<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Water
     */
    // Geometry
    const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128);

    // Material
    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms: {
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
      },
    });

    gui
      .add(waterMaterial.uniforms.uBigWavesElevation, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uBigWavesElevation');
    gui
      .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uBigWavesFrequencyX');
    gui
      .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uBigWavesFrequencyY');

    // Mesh
    const water = new THREE.Mesh(waterGeometry, waterMaterial);

    water.rotation.x = -Math.PI * 0.5;
    scene.add(water);

    /**
     * Camera
     */
    camera.position.set(1, 1, 1);

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
