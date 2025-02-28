<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import CANNON from 'cannon';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Textures
     */
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([
      '/textures/environmentMap/0/px.png',
      '/textures/environmentMap/0/nx.png',
      '/textures/environmentMap/0/py.png',
      '/textures/environmentMap/0/ny.png',
      '/textures/environmentMap/0/pz.png',
      '/textures/environmentMap/0/nz.png',
    ]);

    /**
     * Physics
     */
    // World
    const world = new CANNON.World();

    world.gravity.set(0, -9.82, 0);

    // Materials
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );

    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;

    // Sphere
    const sphereShape = new CANNON.Sphere(0.5);
    const sphereBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: sphereShape,
    });

    world.addBody(sphereBody);

    // Floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();

    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    floorBody.mass = 0;
    floorBody.addShape(floorShape);

    world.addBody(floorBody);

    /**
     * Sphere
     */
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
      })
    );

    sphere.castShadow = true;
    sphere.position.y = 0.5;

    scene.add(sphere);

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
      })
    );

    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;

    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);

    scene.add(directionalLight);

    /**
     * Camera
     */
    camera.position.set(-3, 3, 3);

    /**
     * Renderer
     */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /**
     * Animate
     */
    let oldElapsedTime = 0;

    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
        const deltaTime = elapsedTime - oldElapsedTime;

        oldElapsedTime = elapsedTime;

        // Update physics
        world.step(1 / 60, deltaTime, 3);

        sphere.position.copy(sphereBody.position);
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
