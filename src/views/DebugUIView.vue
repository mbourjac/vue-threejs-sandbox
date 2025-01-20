<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useGui } from '../composables/use-gui';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui({ title: 'Debug UI', width: 300, closeFolders: false });

useThree({
  canvasRef,
  useFullScreen: true,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Debug
     */
    const debug = {
      color: '#a778d8',
    };

    /**
     * Object
     */
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: debug.color });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    // Debug
    gui.add(mesh, 'visible');
    gui.add(material, 'wireframe');

    gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');

    gui.addColor(debug, 'color').onChange(() => {
      material.color.set(debug.color);
    });

    /**
     * Camera
     */
    camera.position.z = 3;

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
