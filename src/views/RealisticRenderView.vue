<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useGui } from '@/composables/use-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  rendererParameters: {
    antialias: true,
  },
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const gltfLoader = new GLTFLoader();
    const rgbeLoader = new RGBELoader();

    /**
     * Environment map
     */
    // Intensity
    scene.environmentIntensity = 1;
    gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001);

    // HDR (RGBE) equirectangular
    rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
      environmentMap.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = environmentMap;
      scene.environment = environmentMap;
    });

    /**
     * Models
     */
    // Helmet
    gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
      gltf.scene.scale.set(10, 10, 10);
      scene.add(gltf.scene);
    });

    /**
     * Camera
     */
    // Base camera
    camera.position.set(4, 5, 4);

    // Controls
    controls!.target.y = 3.5;

    /**
     * Tone mapping
     */
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;

    gui.add(renderer, 'toneMapping', {
      None: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
    });
    gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

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
