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
    const textureLoader = new THREE.TextureLoader();

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
    // Textures
    const earthDayTexture = textureLoader.load('/textures/earth/day.jpg');
    const earthNightTexture = textureLoader.load('/textures/earth/night.jpg');
    const earthSpecularCloudsTexture = textureLoader.load(
      '/textures/earth/specularClouds.jpg'
    );

    earthDayTexture.colorSpace = THREE.SRGBColorSpace;
    earthNightTexture.colorSpace = THREE.SRGBColorSpace;

    // Mesh
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthMaterial = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uDayTexture: new THREE.Uniform(earthDayTexture),
        uNightTexture: new THREE.Uniform(earthNightTexture),
        uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
      },
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
