<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  useFullScreen: true,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001);

    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);

    directionalLight.position.set(2, 2, -1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 6;
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.camera.left = -2;
    directionalLight.shadow.radius = 10;

    gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001);
    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);

    scene.add(directionalLight);

    const directionalLightCameraHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    );

    directionalLightCameraHelper.visible = false;

    scene.add(directionalLightCameraHelper);

    /**
     * Materials
     */
    const material = new THREE.MeshStandardMaterial();

    material.roughness = 0.7;

    gui.add(material, 'metalness').min(0).max(1).step(0.001);
    gui.add(material, 'roughness').min(0).max(1).step(0.001);

    /**
     * Objects
     */
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material
    );

    sphere.castShadow = true;

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);

    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.5;
    plane.receiveShadow = true;

    scene.add(sphere, plane);

    /**
     * Camera
     */
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;

    /**
     * Renderer
     */
    renderer.shadowMap.enabled = true;

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
