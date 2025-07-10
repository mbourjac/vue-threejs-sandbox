<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import earthVertexShader from './shaders/earth/vertex.glsl';
import earthFragmentShader from './shaders/earth/fragment.glsl';
import { useThree } from '@/composables/use-three';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

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
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
      },
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    /**
     * Sun
     */
    // Coordinates
    const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
    const sunDirection = new THREE.Vector3();

    // Debug
    const debugSun = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.1, 2),
      new THREE.MeshBasicMaterial()
    );

    scene.add(debugSun);

    // Update
    const updateSun = () => {
      // Sun direction
      sunDirection.setFromSpherical(sunSpherical);

      // Debug
      debugSun.position.copy(sunDirection).multiplyScalar(5);

      // Uniforms
      earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    };

    updateSun();

    // Controls
    gui.add(sunSpherical, 'phi').min(0).max(Math.PI).onChange(updateSun);

    gui
      .add(sunSpherical, 'theta')
      .min(-Math.PI)
      .max(Math.PI)
      .onChange(updateSun);

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
