<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';
import { useGui } from '@/composables/use-gui';
import gsap from 'gsap';

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
      let particlesIndex = 0;

      // Positions
      const positions = gltf.scene.children
        .filter((child): child is THREE.Mesh => child instanceof THREE.Mesh)
        .map((child) => child.geometry.attributes.position);

      let particlesMaxCount = 0;

      for (const position of positions) {
        if (position.count > particlesMaxCount)
          particlesMaxCount = position.count;
      }

      const particlesPositions: THREE.Float32BufferAttribute[] = [];

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
      const sizesArray = new Float32Array(particlesMaxCount);

      for (let i = 0; i < particlesMaxCount; i++) {
        sizesArray[i] = Math.random();
      }

      const particlesGeometry = new THREE.BufferGeometry();

      particlesGeometry.setAttribute(
        'position',
        particlesPositions[particlesIndex]
      );
      particlesGeometry.setAttribute('aPositionTarget', particlesPositions[2]);
      particlesGeometry.setAttribute(
        'aSize',
        new THREE.BufferAttribute(sizesArray, 1)
      );

      // Material
      const particlesMaterial = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uSize: new THREE.Uniform(0.4),
          uResolution: new THREE.Uniform(resolution.value),
          uProgress: new THREE.Uniform(0),
        },
      });

      // Points
      const particlesPoints = new THREE.Points(
        particlesGeometry,
        particlesMaterial
      );

      scene.add(particlesPoints);

      // Methods
      const morph = (index: number) => {
        // Update attributes
        particlesGeometry.attributes.position =
          particlesPositions[particlesIndex];
        particlesGeometry.attributes.aPositionTarget =
          particlesPositions[index];

        // Animate uProgress
        gsap.fromTo(
          particlesMaterial.uniforms.uProgress,
          { value: 0 },
          { value: 1, duration: 3, ease: 'linear' }
        );

        // Save index
        particlesIndex = index;
      };

      const debug = {
        morph0: () => {
          morph(0);
        },
        morph1: () => {
          morph(1);
        },
        morph2: () => {
          morph(2);
        },
        morph3: () => {
          morph(3);
        },
      };

      // Tweaks
      gui
        .add(particlesMaterial.uniforms.uProgress, 'value')
        .min(0)
        .max(1)
        .step(0.001)
        .name('uProgress')
        .listen();
      gui.add(debug, 'morph0');
      gui.add(debug, 'morph1');
      gui.add(debug, 'morph2');
      gui.add(debug, 'morph3');
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
