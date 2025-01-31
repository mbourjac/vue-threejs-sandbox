<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  useFullScreen: true,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load('/textures/matcaps/1.png');

    matcapTexture.colorSpace = THREE.SRGBColorSpace;

    /**
     * Fonts
     */
    const fontLoader = new FontLoader();

    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('Hello Three.js', {
        font: font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      textGeometry.center();

      const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
      });
      const text = new THREE.Mesh(textGeometry, textMaterial);

      scene.add(text);
    });

    /**
     * Camera
     */
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;

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
