<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { useWindowSize } from '@/composables/use-window-size';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvasRef = useTemplateRef('canvas');

const { width, height } = useWindowSize();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

object3.position.x = 2;

/**
 * Mouse
 */
const mouse = new THREE.Vector2();
let currentIntersect: THREE.Intersection | null = null;

const handleMouse = (event: MouseEvent) => {
  mouse.x = (event.clientX / width.value) * 2 - 1;
  mouse.y = -(event.clientY / height.value) * 2 + 1;
};

const handleClick = () => {
  if (currentIntersect) {
    switch (currentIntersect.object) {
      case object1:
        console.log('click on object 1');
        break;

      case object2:
        console.log('click on object 2');
        break;

      case object3:
        console.log('click on object 3');
        break;
    }
  }
};

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Model
     */
    const gltfLoader = new GLTFLoader();

    let model: THREE.Group | null = null;

    gltfLoader.load('./models/Duck/glTF-Binary/Duck.glb', (gltf) => {
      model = gltf.scene;
      model.position.y = -1.2;
      scene.add(model);
    });

    /**
     * Objects
     */
    scene.add(object1, object2, object3);

    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster();

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.9);

    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1);

    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    /**
     * Camera
     */
    camera.position.z = 3;

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
        // Animate objects
        object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
        object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
        object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

        // Cast a ray
        raycaster.setFromCamera(mouse, camera);
        const objectsToTest = [object1, object2, object3];
        const intersects = raycaster.intersectObjects(objectsToTest);

        if (intersects.length) {
          if (!currentIntersect) {
            console.log('mouse enter');
          }

          currentIntersect = intersects[0];
        } else {
          if (currentIntersect) {
            console.log('mouse leave');
          }

          currentIntersect = null;
        }

        if (model) {
          const modelIntersects = raycaster.intersectObject(model);

          if (modelIntersects.length) {
            model.scale.set(1.2, 1.2, 1.2);
          } else {
            model.scale.set(1, 1, 1);
          }
        }
      },
    });
  },
});

onMounted(() => {
  window.addEventListener('mousemove', handleMouse);
  window.addEventListener('click', handleClick);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouse);
  window.removeEventListener('click', handleClick);
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
