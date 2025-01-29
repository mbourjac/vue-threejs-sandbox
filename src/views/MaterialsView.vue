<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useThree } from '@/composables/use-three';
import * as THREE from 'three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  useFullScreen: true,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const textureLoader = new THREE.TextureLoader();

    /**
     * Objects
     */
    // Textures
    const doorColorTexture = textureLoader.load('./textures/door/color.jpg');
    // const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg');
    const matcapTexture = textureLoader.load('./textures/matcaps/1.png');

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
    const material = new THREE.MeshLambertMaterial();

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
