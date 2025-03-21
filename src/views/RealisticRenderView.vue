<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useGui } from '@/composables/use-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useThree } from '@/composables/use-three';

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
    const textureLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();
    const rgbeLoader = new RGBELoader();

    /**
     * Environment map
     */
    // Intensity
    scene.environmentIntensity = 1;
    gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001);

    // HDR (RGBE) equirectangular
    rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
      environmentMap.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = environmentMap;
      scene.environment = environmentMap;
    });

    /**
     * Models
     */
    const updateAllMaterials = () => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    };

    // Helmet
    gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
      gltf.scene.scale.set(10, 10, 10);
      scene.add(gltf.scene);

      updateAllMaterials();
    });

    /**
     * Floor
     */
    const floorColorTexture = textureLoader.load(
      '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg'
    );
    const floorNormalTexture = textureLoader.load(
      '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png'
    );
    const floorAORoughnessMetalnessTexture = textureLoader.load(
      '/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg'
    );

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorAORoughnessMetalnessTexture,
        roughnessMap: floorAORoughnessMetalnessTexture,
        metalnessMap: floorAORoughnessMetalnessTexture,
      })
    );

    floor.rotation.x = -Math.PI * 0.5;
    floorColorTexture.colorSpace = THREE.SRGBColorSpace;

    scene.add(floor);

    /**
     * Wall
     */
    const wallColorTexture = textureLoader.load(
      '/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg'
    );
    const wallNormalTexture = textureLoader.load(
      '/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png'
    );
    const wallAORoughnessMetalnessTexture = textureLoader.load(
      '/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg'
    );

    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        aoMap: wallAORoughnessMetalnessTexture,
        roughnessMap: wallAORoughnessMetalnessTexture,
        metalnessMap: wallAORoughnessMetalnessTexture,
      })
    );

    wall.position.y = 4;
    wall.position.z = -4;
    wallColorTexture.colorSpace = THREE.SRGBColorSpace;

    scene.add(wall);

    /**
     * Directional light
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 6);

    directionalLight.position.set(-4, 6.5, 2.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(512, 512);

    // Target
    directionalLight.target.position.set(0, 4, 0);
    directionalLight.target.updateWorldMatrix(true, true);

    scene.add(directionalLight);

    // // Helper
    // const directionalLightCameraHelper = new THREE.CameraHelper(
    //   directionalLight.shadow.camera
    // );

    // scene.add(directionalLightCameraHelper);

    gui
      .add(directionalLight, 'intensity')
      .min(0)
      .max(10)
      .step(0.001)
      .name('lightIntensity');
    gui
      .add(directionalLight.position, 'x')
      .min(-10)
      .max(10)
      .step(0.001)
      .name('lightX');
    gui
      .add(directionalLight.position, 'y')
      .min(-10)
      .max(10)
      .step(0.001)
      .name('lightY');
    gui
      .add(directionalLight.position, 'z')
      .min(-10)
      .max(10)
      .step(0.001)
      .name('lightZ');
    gui.add(directionalLight, 'castShadow');

    /**
     * Camera
     */
    // Base camera
    camera.position.set(4, 5, 4);

    // Controls
    controls!.target.y = 3.5;

    /**
     * Renderer
     */
    // Shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Tone mapping
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;

    gui.add(renderer, 'toneMapping', {
      None: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
    });
    gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

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
