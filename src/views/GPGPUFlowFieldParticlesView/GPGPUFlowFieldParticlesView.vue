<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  rendererParameters: {
    antialias: true,
  },
  setupScene: ({
    scene,
    renderer,
    animate,
    controls,
    camera,
    sizes: { resolution },
  }) => {
    /**
     * Camera
     */
    camera.fov = 35;
    camera.updateProjectionMatrix();
    camera.position.set(4.5, 4, 11);

    /**
     * Particles
     */
    class Particles {
      geometry: THREE.SphereGeometry;
      material: THREE.ShaderMaterial;
      points: THREE.Points;

      constructor() {
        // Geometry
        this.geometry = new THREE.SphereGeometry(3);

        // Material
        this.material = new THREE.ShaderMaterial({
          vertexShader: particlesVertexShader,
          fragmentShader: particlesFragmentShader,
          uniforms: {
            uSize: new THREE.Uniform(0.4),
            uResolution: new THREE.Uniform(resolution.value),
          },
        });

        // Points
        this.points = new THREE.Points(this.geometry, this.material);
      }
    }

    const particles = new Particles();

    scene.add(particles.points);

    // Controllers
    gui
      .add(particles.material.uniforms.uSize, 'value')
      .min(0)
      .max(1)
      .step(0.001)
      .name('uSize');

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
