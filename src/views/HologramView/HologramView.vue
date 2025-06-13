<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useThree } from '@/composables/use-three';
import hologramVertexShader from './shaders/hologram/vertex.glsl';
import hologramFragmentShader from './shaders/hologram/fragment.glsl';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  rendererParameters: {
    antialias: true,
  },
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const gltfLoader = new GLTFLoader();

    /**
     * Camera
     */
    camera.position.set(7, 7, 7);
    camera.fov = 25;
    camera.updateProjectionMatrix();

    /**
     * Material
     */
    const material = new THREE.ShaderMaterial({
      vertexShader: hologramVertexShader,
      fragmentShader: hologramFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    /**
     * Objects
     */
    // Torus knot
    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
      material
    );
    torusKnot.position.x = 3;
    scene.add(torusKnot);

    // Sphere
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
    sphere.position.x = -3;
    scene.add(sphere);

    // Suzanne
    let suzanne: THREE.Object3D | null = null;

    gltfLoader.load('./models/suzanne.glb', (gltf) => {
      suzanne = gltf.scene;
      suzanne.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });

      scene.add(suzanne);
    });

    /**
     * Renderer
     */
    renderer.setClearColor('#1d1f2a');

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
        // Update material
        material.uniforms.uTime.value = elapsedTime;

        // Rotate objects
        if (suzanne) {
          suzanne.rotation.x = -elapsedTime * 0.1;
          suzanne.rotation.y = elapsedTime * 0.2;
        }

        sphere.rotation.x = -elapsedTime * 0.1;
        sphere.rotation.y = elapsedTime * 0.2;

        torusKnot.rotation.x = -elapsedTime * 0.1;
        torusKnot.rotation.y = elapsedTime * 0.2;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
