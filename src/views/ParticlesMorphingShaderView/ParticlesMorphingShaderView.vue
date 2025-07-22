<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';

const canvasRef = useTemplateRef('canvas');

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
     * Loaders
     */
    const dracoLoader = new DRACOLoader();
    const gltfLoader = new GLTFLoader();

    dracoLoader.setDecoderPath('./draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    /**
     * Models
     */
    gltfLoader.load('./models/particlesMorphing.glb', (gltf) => {
      /**
       * Particles
       */
      // Positions
      const positions = gltf.scene.children
        .filter((child): child is THREE.Mesh => child instanceof THREE.Mesh)
        .map((child) => child.geometry.attributes.position);

      let particlesMaxCount = 0;

      for (const position of positions) {
        if (position.count > particlesMaxCount)
          particlesMaxCount = position.count;
      }

      const particlesPositions = [];

      for (const position of positions) {
        const originalArray = position.array;
        const newArray = new Float32Array(particlesMaxCount * 3);

        for (let i = 0; i < particlesMaxCount; i++) {
          const i3 = i * 3;

          if (i3 < originalArray.length) {
            newArray[i3 + 0] = originalArray[i3 + 0];
            newArray[i3 + 1] = originalArray[i3 + 1];
            newArray[i3 + 2] = originalArray[i3 + 2];
          } else {
            const randomIndex = Math.floor(position.count * Math.random()) * 3;

            newArray[i3 + 0] = originalArray[randomIndex + 0];
            newArray[i3 + 1] = originalArray[randomIndex + 1];
            newArray[i3 + 2] = originalArray[randomIndex + 2];
          }
        }

        particlesPositions.push(new THREE.Float32BufferAttribute(newArray, 3));
      }

      // Geometry
      const particlesGeometry = new THREE.BufferGeometry();

      particlesGeometry.setAttribute('position', particlesPositions[0]);

      // Material
      const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uSize: new THREE.Uniform(0.2),
          uResolution: new THREE.Uniform(resolution.value),
        },
      });

      // Points
      const particlesPoints = new THREE.Points(
        particlesGeometry,
        particlesMaterial
      );

      scene.add(particlesPoints);
    });

    /**
     * Camera
     */
    camera.fov = 35;
    camera.updateProjectionMatrix();
    camera.position.set(0, 0, 8 * 2);

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
