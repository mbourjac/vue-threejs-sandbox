<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Galaxy
     */
    const parameters = {
      count: 100000,
      size: 0.01,
    };

    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.PointsMaterial | null = null;
    let points: THREE.Points | null = null;

    const generateGalaxy = () => {
      /**
       * Geometry
       */

      // Destroy old galaxy
      if (points !== null) {
        geometry!.dispose();
        material!.dispose();
        scene.remove(points);
      }

      geometry = new THREE.BufferGeometry();

      const positions = new Float32Array(parameters.count * 3);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        positions[i3] = (Math.random() - 0.5) * 3;
        positions[i3 + 1] = (Math.random() - 0.5) * 3;
        positions[i3 + 2] = (Math.random() - 0.5) * 3;
      }

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );

      /**
       * Material
       */
      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      /**
       * Points
       */
      points = new THREE.Points(geometry, material);

      scene.add(points);
    };

    gui
      .add(parameters, 'count')
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, 'size')
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(generateGalaxy);

    generateGalaxy();

    /**
     * Camera
     */
    camera.position.x = 3;
    camera.position.y = 3;
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
