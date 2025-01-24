<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onStart = () => {
      console.log('loading started');
    };
    loadingManager.onLoad = () => {
      console.log('loading finished');
    };
    loadingManager.onProgress = () => {
      console.log('loading progressing');
    };
    loadingManager.onError = () => {
      console.log('loading error');
    };

    const textureLoader = new THREE.TextureLoader(loadingManager);

    /**
     * Object
     */
    // Texture
    const colorTexture = textureLoader.load('/textures/door/color.jpg');

    colorTexture.colorSpace = THREE.SRGBColorSpace;

    // const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
    // const heightTexture = textureLoader.load('/textures/door/height.jpg');
    // const normalTexture = textureLoader.load('/textures/door/normal.jpg');
    // const ambientOcclusionTexture = textureLoader.load(
    //   '/textures/door/ambientOcclusion.jpg'
    // );
    // const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
    // const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

    // Repeat texture
    // colorTexture.wrapS = THREE.RepeatWrapping;
    // colorTexture.wrapT = THREE.RepeatWrapping;
    // colorTexture.repeat.x = 2;
    // colorTexture.repeat.y = 3;

    // Offset texture
    // colorTexture.offset.x = 0.5;
    // colorTexture.offset.y = 0.5;

    // Rotate texture
    colorTexture.rotation = Math.PI * 0.25;
    colorTexture.center.x = 0.5;
    colorTexture.center.y = 0.5;

    // Mesh
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ map: colorTexture })
    );

    scene.add(mesh);

    /**
     * Camera
     */
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;

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
