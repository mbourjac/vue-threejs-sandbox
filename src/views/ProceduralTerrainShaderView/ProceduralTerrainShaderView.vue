<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const rgbeLoader = new RGBELoader();

    /**
     * Environment map
     */

    rgbeLoader.load(
      './environmentMaps/spruit_sunrise.hdr',
      (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = environmentMap;
        scene.backgroundBlurriness = 0.5;
        scene.environment = environmentMap;
      }
    );

    /**
     * Placeholder
     */
    const placeholder = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 5),
      new THREE.MeshPhysicalMaterial()
    );

    scene.add(placeholder);

    /**
     * Board
     */
    // Brushes
    const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11));
    const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10));

    // Evaluate
    const evaluator = new Evaluator();
    const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION);

    board.geometry.clearGroups();
    board.material = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.3,
    });
    board.castShadow = true;
    board.receiveShadow = true;

    scene.add(board);

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 2);

    directionalLight.position.set(6.25, 3, 4);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 30;
    directionalLight.shadow.camera.top = 8;
    directionalLight.shadow.camera.right = 8;
    directionalLight.shadow.camera.bottom = -8;
    directionalLight.shadow.camera.left = -8;

    scene.add(directionalLight);

    /**
     * Camera
     */
    camera.position.set(-10, 6, -2);
    camera.fov = 35;
    camera.updateProjectionMatrix();

    /**
     * Renderer
     */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

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
