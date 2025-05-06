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
    // Parameters
    const parameters = {
      depthColor: '#186691',
      surfaceColor: '#9bd8ff',
    };

    // Geometry
    const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128);

    // Material
    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBigWavesSpeed: { value: 0.75 },
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uDepthColor: { value: new THREE.Color(parameters.depthColor) },
        uSurfaceColor: { value: new THREE.Color(parameters.surfaceColor) },
        uColorOffset: { value: 0.15 },
        uColorMultiplier: { value: 3 },
      },
    });

    gui
      .add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
      .min(0)
      .max(4)
      .step(0.001)
      .name('uBigWavesSpeed');
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
    gui.addColor(parameters, 'depthColor').onChange(() => {
      waterMaterial.uniforms.uDepthColor.value.set(parameters.depthColor);
    });
    gui.addColor(parameters, 'surfaceColor').onChange(() => {
      waterMaterial.uniforms.uSurfaceColor.value.set(parameters.surfaceColor);
    });
    gui
      .add(waterMaterial.uniforms.uColorOffset, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uColorOffset');
    gui
      .add(waterMaterial.uniforms.uColorMultiplier, 'value')
      .min(0)
      .max(10)
      .step(0.001)
      .name('uColorMultiplier');

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
      tick: (elapsedTime) => {
        // Water
        waterMaterial.uniforms.uTime.value = elapsedTime;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
