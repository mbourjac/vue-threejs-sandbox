<script setup lang="ts">
import { useTemplateRef, watchEffect } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera, sizes }) => {
    /**
     * Camera
     */
    camera.position.set(0, 0, 18);
    camera.fov = 35;
    camera.updateProjectionMatrix();

    /**
     * Renderer
     */
    renderer.setClearColor('#181818');

    /**
     * Particles
     */
    const particlesGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            sizes.width.value * sizes.pixelRatio.value,
            sizes.height.value * sizes.pixelRatio.value
          )
        ),
      },
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);

    scene.add(particles);

    watchEffect(() => {
      particlesMaterial.uniforms.uResolution.value.set(
        sizes.width.value * sizes.pixelRatio.value,
        sizes.height.value * sizes.pixelRatio.value
      );
    });

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
