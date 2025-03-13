<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useGui } from '@/composables/use-gui';

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
    // const rgbeLoader = new RGBELoader();
    const textureLoader = new THREE.TextureLoader();

    /**
     * Real time environment map
     */
    // Base environment map
    const environmentMap = textureLoader.load(
      '/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg'
    );

    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    environmentMap.colorSpace = THREE.SRGBColorSpace;

    scene.background = environmentMap;

    // Holy donut
    const holyDonut = new THREE.Mesh(
      new THREE.TorusGeometry(8, 0.5),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
    );

    holyDonut.layers.enable(1);
    holyDonut.position.y = 3.5;

    scene.add(holyDonut);

    // Cube render target
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      type: THREE.FloatType,
    });

    scene.environment = cubeRenderTarget.texture;

    // Cube camera
    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

    cubeCamera.layers.set(1);

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

    // // Ground projected skybox
    // rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap) => {
    //   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    //   scene.environment = environmentMap;

    //   // Skybox
    //   const skybox = new GroundedSkybox(environmentMap, 15, 70);
    //   skybox.material.wireframe = true;
    //   skybox.position.y = 15;
    //   scene.add(skybox);
    // });

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
      tick: (elapsedTime) => {
        // Real time environment map
        if (holyDonut) {
          holyDonut.rotation.x = Math.sin(elapsedTime) * 2;

          cubeCamera.update(renderer, scene);
        }
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
