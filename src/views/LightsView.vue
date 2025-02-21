<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  useFullScreen: true,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);

    directionalLight.position.set(1, 0.25, 0);

    scene.add(directionalLight);

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2
    );

    scene.add(directionalLightHelper);

    // Hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);

    scene.add(hemisphereLight);

    const hemisphereLightHelper = new THREE.HemisphereLightHelper(
      hemisphereLight,
      0.2
    );

    scene.add(hemisphereLightHelper);

    // Point light
    const pointLight = new THREE.PointLight(0xff9000, 1.5, 0, 2);

    pointLight.position.set(1, -0.5, 1);

    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);

    scene.add(pointLightHelper);

    // React area light
    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);

    rectAreaLight.position.set(-1.5, 0, 1.5);
    rectAreaLight.lookAt(new THREE.Vector3());

    scene.add(rectAreaLight);

    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);

    scene.add(rectAreaLightHelper);

    // Spot light
    const spotLight = new THREE.SpotLight(
      0x78ff00,
      4.5,
      10,
      Math.PI * 0.1,
      0.25,
      1
    );

    spotLight.position.set(0, 2, 3);
    spotLight.target.position.x = -0.75;

    scene.add(spotLight.target);
    scene.add(spotLight);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);

    scene.add(spotLightHelper);

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.4;

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material
    );
    sphere.position.x = -1.5;

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.75),
      material
    );

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 32, 64),
      material
    );
    torus.position.x = 1.5;

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;

    scene.add(sphere, cube, torus, plane);

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
        cube.rotation.y = 0.1 * elapsedTime;
        torus.rotation.y = 0.1 * elapsedTime;

        sphere.rotation.x = 0.15 * elapsedTime;
        cube.rotation.x = 0.15 * elapsedTime;
        torus.rotation.x = 0.15 * elapsedTime;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
