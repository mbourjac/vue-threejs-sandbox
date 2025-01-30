<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useThree } from '@/composables/use-three';
import * as THREE from 'three';
import { useGui } from '@/composables/use-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  useFullScreen: true,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const textureLoader = new THREE.TextureLoader();
    const rgbeLoader = new RGBELoader();

    /**
     * Environment map
     */
    rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
      environmentMap.mapping = THREE.EquirectangularReflectionMapping;

      scene!.background = environmentMap;
      scene!.environment = environmentMap;
    });

    /**
     * Objects
     */
    // Textures
    const doorColorTexture = textureLoader.load('./textures/door/color.jpg');
    const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg');
    const doorAmbientOcclusionTexture = textureLoader.load(
      './textures/door/ambientOcclusion.jpg'
    );
    const doorHeightTexture = textureLoader.load('./textures/door/height.jpg');
    const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg');
    const doorMetalnessTexture = textureLoader.load(
      './textures/door/metalness.jpg'
    );
    const doorRoughnessTexture = textureLoader.load(
      './textures/door/roughness.jpg'
    );
    const matcapTexture = textureLoader.load('./textures/matcaps/1.png');
    // const gradientTexture = textureLoader.load('./textures/gradients/3.jpg');

    doorColorTexture.colorSpace = THREE.SRGBColorSpace;
    matcapTexture.colorSpace = THREE.SRGBColorSpace;

    // MeshBasicMaterial
    // const material = new THREE.MeshBasicMaterial();

    // material.map = doorColorTexture;
    // material.color = new THREE.Color('#ff0000');
    // material.wireframe = true;
    // material.transparent = true;
    // material.opacity = 0.5;
    // material.alphaMap = doorAlphaTexture;
    // material.side = THREE.DoubleSide;

    // MeshNormalMaterial
    // const material = new THREE.MeshNormalMaterial();

    // material.flatShading = true;

    // MeshMatcapMaterial
    // const material = new THREE.MeshMatcapMaterial();

    // material.matcap = matcapTexture;

    // MeshDepthMaterial
    // const material = new THREE.MeshDepthMaterial();

    // MeshLambertMaterial
    // const material = new THREE.MeshLambertMaterial();

    // MeshPhongMaterial
    // const material = new THREE.MeshPhongMaterial();

    // material.shininess = 100;
    // material.specular = new THREE.Color(0x1188ff);

    // MeshToonMaterial
    // const material = new THREE.MeshToonMaterial();

    // gradientTexture.minFilter = THREE.NearestFilter;
    // gradientTexture.magFilter = THREE.NearestFilter;
    // gradientTexture.generateMipmaps = false;
    // material.gradientMap = gradientTexture;

    // MeshStandardMaterial
    const material = new THREE.MeshStandardMaterial();

    material.metalness = 1;
    material.roughness = 1;

    gui.add(material, 'metalness').min(0).max(1).step(0.0001);
    gui.add(material, 'roughness').min(0).max(1).step(0.0001);

    material.map = doorColorTexture;

    material.aoMap = doorAmbientOcclusionTexture;
    material.aoMapIntensity = 1;
    material.displacementMap = doorHeightTexture;
    material.displacementScale = 0.1;

    material.metalnessMap = doorMetalnessTexture;
    material.roughnessMap = doorRoughnessTexture;

    material.normalMap = doorNormalTexture;
    material.normalScale.set(0.5, 0.5);

    material.transparent = true;
    material.alphaMap = doorAlphaTexture;

    // Sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      material
    );

    sphere.position.x = -1.5;

    // Plane
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

    // Torus
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 16, 32),
      material
    );

    torus.position.x = 1.5;

    scene.add(sphere, plane, torus);

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    scene.add(ambientLight);

    // Point light
    const pointLight = new THREE.PointLight(0xffffff, 30);

    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;

    scene.add(pointLight);

    /**
     * Camera
     */
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
        // Update objects
        sphere.rotation.y = 0.1 * elapsedTime;
        plane.rotation.y = 0.1 * elapsedTime;
        torus.rotation.y = 0.1 * elapsedTime;

        sphere.rotation.x = -0.15 * elapsedTime;
        plane.rotation.x = -0.15 * elapsedTime;
        torus.rotation.x = -0.15 * elapsedTime;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
