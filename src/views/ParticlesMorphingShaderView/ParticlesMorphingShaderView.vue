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
      class Particles {
        geometry: THREE.BufferGeometry;
        material: THREE.ShaderMaterial;
        points: THREE.Points;
        index: number;
        primaryColor: string;
        secondaryColor: string;
        maxCount: number;
        morph0: () => void;
        morph1: () => void;
        morph2: () => void;
        morph3: () => void;

        constructor() {
          this.index = 0;

          this.primaryColor = '#ff7300';
          this.secondaryColor = '#0091ff';

          // Positions
          const positions = gltf.scene.children
            .filter((child): child is THREE.Mesh => child instanceof THREE.Mesh)
            .map((child) => child.geometry.attributes.position);

          this.maxCount = 0;

          for (const position of positions) {
            if (position.count > this.maxCount) this.maxCount = position.count;
          }

          const particlesPositions: THREE.Float32BufferAttribute[] = [];

          for (const position of positions) {
            const originalArray = position.array;
            const newArray = new Float32Array(this.maxCount * 3);

            for (let i = 0; i < this.maxCount; i++) {
              const i3 = i * 3;

              if (i3 < originalArray.length) {
                newArray[i3 + 0] = originalArray[i3 + 0];
                newArray[i3 + 1] = originalArray[i3 + 1];
                newArray[i3 + 2] = originalArray[i3 + 2];
              } else {
                const randomIndex =
                  Math.floor(position.count * Math.random()) * 3;

                newArray[i3 + 0] = originalArray[randomIndex + 0];
                newArray[i3 + 1] = originalArray[randomIndex + 1];
                newArray[i3 + 2] = originalArray[randomIndex + 2];
              }
            }

            particlesPositions.push(
              new THREE.Float32BufferAttribute(newArray, 3)
            );
          }

          // Geometry
          const sizesArray = new Float32Array(this.maxCount);

          for (let i = 0; i < this.maxCount; i++) {
            sizesArray[i] = Math.random();
          }

          this.geometry = new THREE.BufferGeometry();

          this.geometry.setAttribute(
            'position',
            particlesPositions[this.index]
          );
          this.geometry.setAttribute('aPositionTarget', particlesPositions[2]);
          this.geometry.setAttribute(
            'aSize',
            new THREE.BufferAttribute(sizesArray, 1)
          );

          // Material
          this.material = new THREE.ShaderMaterial({
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
              uSize: new THREE.Uniform(0.4),
              uResolution: new THREE.Uniform(resolution.value),
              uProgress: new THREE.Uniform(0),
              uPrimaryColor: new THREE.Uniform(
                new THREE.Color(this.primaryColor)
              ),
              uSecondaryColor: new THREE.Uniform(
                new THREE.Color(this.secondaryColor)
              ),
            },
          });

          // Points
          this.points = new THREE.Points(this.geometry, this.material);
          this.points.frustumCulled = false;

          // Methods
          const morph = (index: number) => {
            // Update attributes
            this.geometry.attributes.position = particlesPositions[this.index];
            this.geometry.attributes.aPositionTarget =
              particlesPositions[index];

            // Animate uProgress
            gsap.fromTo(
              this.material.uniforms.uProgress,
              { value: 0 },
              { value: 1, duration: 3, ease: 'linear' }
            );

            // Save index
            this.index = index;
          };

          this.morph0 = () => {
            morph(0);
          };
          this.morph1 = () => {
            morph(1);
          };
          this.morph2 = () => {
            morph(2);
          };
          this.morph3 = () => {
            morph(3);
          };
        }
      }

      const particles = new Particles();

      scene.add(particles.points);

      // Controllers
      gui
        .add(particles.material.uniforms.uProgress, 'value')
        .min(0)
        .max(1)
        .step(0.001)
        .name('uProgress')
        .listen();

      gui.add(particles, 'morph0');
      gui.add(particles, 'morph1');
      gui.add(particles, 'morph2');
      gui.add(particles, 'morph3');

      gui.addColor(particles, 'primaryColor').onChange(() => {
        particles.material.uniforms.uPrimaryClor.value.set(
          particles.primaryColor
        );
      });
      gui.addColor(particles, 'secondaryColor').onChange(() => {
        particles.material.uniforms.uSecondaryColor.value.set(
          particles.secondaryColor
        );
      });
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
