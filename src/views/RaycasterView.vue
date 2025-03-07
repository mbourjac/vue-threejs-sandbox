<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { useWindowSize } from '@/composables/use-window-size';

const canvasRef = useTemplateRef('canvas');

const { width, height } = useWindowSize();

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

const handleMouse = (event: MouseEvent) => {
  mouse.x = (event.clientX / width.value) * 2 - 1;
  mouse.y = -(event.clientY / height.value) * 2 + 1;
};

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
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

    scene.add(object1, object2, object3);

    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster();

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

        for (const object of objectsToTest) {
          object.material.color.set('#ff0000');
        }

        for (const intersect of intersects) {
          if (intersect.object instanceof THREE.Mesh) {
            intersect.object.material.color.set('#0000ff');
          }
        }
      },
    });
  },
});

onMounted(() => {
  window.addEventListener('mousemove', handleMouse);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouse);
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
