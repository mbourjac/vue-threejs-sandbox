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
     * Object
     */
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    // Debug
    gui.add(mesh, 'visible');
    gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');

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
