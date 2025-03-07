<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

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
        const rayOrigin = new THREE.Vector3(-3, 0, 0);
        const rayDirection = new THREE.Vector3(1, 0, 0);

        rayDirection.normalize();
        raycaster.set(rayOrigin, rayDirection);

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
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
