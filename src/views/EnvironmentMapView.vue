<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const gltfLoader = new GLTFLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    /**
     * Environment map
     */
    // LDR cube texture
    const environmentMap = cubeTextureLoader.load([
      '/environmentMaps/0/px.png',
      '/environmentMaps/0/nx.png',
      '/environmentMaps/0/py.png',
      '/environmentMaps/0/ny.png',
      '/environmentMaps/0/pz.png',
      '/environmentMaps/0/nz.png',
    ]);

    scene.environment = environmentMap;
    scene.background = environmentMap;

    /**
     * Model
     */
    gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
      gltf.scene.scale.set(10, 10, 10);
      scene.add(gltf.scene);
    });

    /**
     * Torus Knot
     */
    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
      new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 1,
        color: 0xaaaaaa,
      })
    );

    torusKnot.position.x = -4;
    torusKnot.position.y = 4;

    scene.add(torusKnot);

    /**
     * Camera
     */
    camera.position.set(4, 5, 4);
    controls!.target.y = 3.5;

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
