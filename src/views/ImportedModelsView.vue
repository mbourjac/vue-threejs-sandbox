<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Models
     */
    const gltfLoader = new GLTFLoader();

    let mixer: THREE.AnimationMixer | null = null;

    gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
      gltf.scene.scale.set(0.03, 0.03, 0.03);
      scene.add(gltf.scene);

      mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    });

    /**
     * Floor
     */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
      })
    );

    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;

    scene.add(floor);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);

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
    camera.position.set(2, 2, 2);

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
        if (mixer) {
          mixer.update(deltaTime);
        }
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
