<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';
import { useGui } from '@/composables/use-gui';
import {
  GPUComputationRenderer,
  type Variable,
} from 'three/examples/jsm/Addons.js';
import gpgpuParticlesShader from './shaders/gpgpu/particles.glsl';

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
     * Base geometry
     */
    class BaseGeometry {
      instance: THREE.BufferGeometry;
      count: number;

      constructor() {
        this.instance = new THREE.SphereGeometry(3);
        this.count = this.instance.attributes.position.count;
      }
    }

    const baseGeometry = new BaseGeometry();

    /**
     * GPU Compute
     */
    class GPGPU {
      size: number;
      computation: GPUComputationRenderer;
      particlesVariable: Variable;

      constructor() {
        this.size = Math.ceil(Math.sqrt(baseGeometry.count));

        this.computation = new GPUComputationRenderer(
          this.size,
          this.size,
          renderer
        );

        // Base particles
        const baseParticlesTexture = this.computation.createTexture();

        for (let i = 0; i < baseGeometry.count; i++) {
          const i3 = i * 3;
          const i4 = i * 4;

          // Position based on geometry
          baseParticlesTexture.image.data[i4 + 0] =
            baseGeometry.instance.attributes.position.array[i3 + 0];
          baseParticlesTexture.image.data[i4 + 1] =
            baseGeometry.instance.attributes.position.array[i3 + 1];
          baseParticlesTexture.image.data[i4 + 2] =
            baseGeometry.instance.attributes.position.array[i3 + 2];
          baseParticlesTexture.image.data[i4 + 3] = 0;
        }

        console.log(baseParticlesTexture.image.data);

        // Particles variable
        this.particlesVariable = this.computation.addVariable(
          'uParticles',
          gpgpuParticlesShader,
          baseParticlesTexture
        );
        this.computation.setVariableDependencies(this.particlesVariable, [
          this.particlesVariable,
        ]);

        // Init
        this.computation.init();
      }
    }

    const gpgpu = new GPGPU();

    const debug = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.MeshBasicMaterial({
        map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable)
          .texture,
      })
    );

    debug.position.x = 3;

    scene.add(debug);

    /**
     * Particles
     */
    class Particles {
      geometry: THREE.BufferGeometry;
      material: THREE.ShaderMaterial;
      points: THREE.Points;

      constructor() {
        // Geometry
        const particlesUvArray = new Float32Array(baseGeometry.count * 2);

        for (let y = 0; y < gpgpu.size; y++) {
          for (let x = 0; x < gpgpu.size; x++) {
            const i = y * gpgpu.size + x;
            const i2 = i * 2;

            // Particles UV
            const uvX = (x + 0.5) / gpgpu.size;
            const uvY = (y + 0.5) / gpgpu.size;

            particlesUvArray[i2 + 0] = uvX;
            particlesUvArray[i2 + 1] = uvY;
          }
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setDrawRange(0, baseGeometry.count);
        this.geometry.setAttribute(
          'aParticlesUv',
          new THREE.BufferAttribute(particlesUvArray, 2)
        );

        // Material
        this.material = new THREE.ShaderMaterial({
          vertexShader: particlesVertexShader,
          fragmentShader: particlesFragmentShader,
          uniforms: {
            uSize: new THREE.Uniform(0.4),
            uResolution: new THREE.Uniform(resolution.value),
            uParticlesTexture: new THREE.Uniform(null),
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
      tick: () => {
        // GPGPU Update
        gpgpu.computation.compute();
        particles.material.uniforms.uParticlesTexture.value =
          gpgpu.computation.getCurrentRenderTarget(
            gpgpu.particlesVariable
          ).texture;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
