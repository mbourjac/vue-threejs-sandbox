<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import shadingVertexShader from './shaders/shading/vertex.glsl';
import shadingFragmentShader from './shaders/shading/fragment.glsl';
import { useThree } from '@/composables/use-three';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

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
    camera.position.x = 7;
    camera.position.y = 7;
    camera.position.z = 7;

    camera.fov = 25;
    camera.updateProjectionMatrix();

    /**
     * Material
     */
    const materialParameters = {
      color: '#ffffff',
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: shadingVertexShader,
      fragmentShader: shadingFragmentShader,
      uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
      },
    });

    gui.addColor(materialParameters, 'color').onChange(() => {
      material.uniforms.uColor.value.set(materialParameters.color);
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
     * Light helpers
     */
    const directionalLightHelper = new THREE.Mesh(
      new THREE.PlaneGeometry(),
      new THREE.MeshBasicMaterial()
    );

    directionalLightHelper.material.color.setRGB(0.1, 0.1, 1);
    directionalLightHelper.material.side = THREE.DoubleSide;
    directionalLightHelper.position.set(0, 0, 3);

    scene.add(directionalLightHelper);

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
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
