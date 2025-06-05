<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useThree } from '@/composables/use-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const gltfLoader = new GLTFLoader();

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
