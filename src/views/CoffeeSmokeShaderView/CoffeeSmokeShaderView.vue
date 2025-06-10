<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useThree } from '@/composables/use-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import coffeeSmokeVertexShader from './shaders/vertex.glsl';
import coffeeSmokeFragmentShader from './shaders/fragment.glsl';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();

    /**
     * Camera
     */
    camera.position.x = 8;
    camera.position.y = 10;
    camera.position.z = 12;

    controls!.target.y = 3;

    /**
     * Model
     */
    gltfLoader.load('./models/bakedModel.glb', (gltf) => {
      const bakedMesh = gltf.scene.getObjectByName('baked');

      if (bakedMesh instanceof THREE.Mesh) {
        bakedMesh.material.map.anisotropy = 8;
      }

      scene.add(gltf.scene);
    });

    /**
     * Smoke
     */
    // Geometry
    const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);

    smokeGeometry.translate(0, 0.5, 0);
    smokeGeometry.scale(1.5, 6, 1.5);

    // Perlin texture
    const perlinTexture = textureLoader.load('./textures/perlin.png');
    perlinTexture.wrapS = THREE.RepeatWrapping;
    perlinTexture.wrapT = THREE.RepeatWrapping;

    // Material
    const smokeMaterial = new THREE.ShaderMaterial({
      vertexShader: coffeeSmokeVertexShader,
      fragmentShader: coffeeSmokeFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uPerlinTexture: new THREE.Uniform(perlinTexture),
      },
      side: THREE.DoubleSide,
      transparent: true,
      wireframe: true,
    });
    // Mesh
    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);

    smoke.position.y = 1.83;

    scene.add(smoke);

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
        // Update smoke
        smokeMaterial.uniforms.uTime.value = elapsedTime;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
