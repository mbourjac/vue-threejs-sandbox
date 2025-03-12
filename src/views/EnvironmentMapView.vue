<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useGui } from '@/composables/use-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GroundedSkybox } from 'three/examples/jsm/Addons.js';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const gltfLoader = new GLTFLoader();
    // const cubeTextureLoader = new THREE.CubeTextureLoader();
    const rgbeLoader = new RGBELoader();

    /**
     * Environment map
     */
    // LDR cube texture
    // const environmentMap = cubeTextureLoader.load([
    //   '/environmentMaps/0/px.png',
    //   '/environmentMaps/0/nx.png',
    //   '/environmentMaps/0/py.png',
    //   '/environmentMaps/0/ny.png',
    //   '/environmentMaps/0/pz.png',
    //   '/environmentMaps/0/nz.png',
    // ]);

    // scene.environment = environmentMap;
    // scene.background = environmentMap;

    // HDR (RGBE) equirectangular
    // rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
    //   environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    //   scene.background = environmentMap;
    //   scene.environment = environmentMap;
    // });

    // Ground projected skybox
    rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap) => {
      environmentMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = environmentMap;

      // Skybox
      const skybox = new GroundedSkybox(environmentMap, 15, 70);
      skybox.material.wireframe = true;
      skybox.position.y = 15;
      scene.add(skybox);
    });

    scene.environmentIntensity = 1;
    scene.backgroundBlurriness = 0;
    scene.backgroundIntensity = 1;

    gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001);
    gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001);
    gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001);
    gui
      .add(scene.backgroundRotation, 'y')
      .min(0)
      .max(Math.PI * 2)
      .step(0.001)
      .name('backgroundRotationY');
    gui
      .add(scene.environmentRotation, 'y')
      .min(0)
      .max(Math.PI * 2)
      .step(0.001)
      .name('environmentRotationY');

    /**
     * Model
     */
    gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
      gltf.scene.scale.set(10, 10, 10);
      scene.add(gltf.scene);
    });

    /**
     * Torus Knot
     */
    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
      new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 1,
        color: 0xaaaaaa,
      })
    );

    torusKnot.position.x = -4;
    torusKnot.position.y = 4;

    scene.add(torusKnot);

    /**
     * Camera
     */
    camera.position.set(4, 5, 4);
    controls!.target.y = 3.5;

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
