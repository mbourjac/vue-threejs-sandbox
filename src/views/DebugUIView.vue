<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
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
      spin: () => {
        gsap.to(mesh.rotation, {
          duration: 1,
          y: mesh.rotation.y + Math.PI * 2,
        });
      },
      subdivision: 2,
    };

    /**
     * Object
     */
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: debug.color });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    // Debug
    const cubeTweaks = gui.addFolder('Cube');

    cubeTweaks.add(mesh, 'visible');
    cubeTweaks.add(material, 'wireframe');

    cubeTweaks
      .add(mesh.position, 'y')
      .min(-3)
      .max(3)
      .step(0.01)
      .name('elevation');

    cubeTweaks.addColor(debug, 'color').onChange(() => {
      material.color.set(debug.color);
    });

    cubeTweaks.add(debug, 'spin');

    cubeTweaks
      .add(debug, 'subdivision')
      .min(1)
      .max(20)
      .step(1)
      .onFinishChange(() => {
        mesh.geometry.dispose();
        mesh.geometry = new THREE.BoxGeometry(
          1,
          1,
          1,
          debug.subdivision,
          debug.subdivision,
          debug.subdivision
        );
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
