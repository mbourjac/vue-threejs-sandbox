<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';

const canvasRef = useTemplateRef('canvas');

const sizes = {
  width: 800,
  height: 600,
};

let scene: THREE.Scene | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let camera: THREE.PerspectiveCamera | null = null;

const setupScene = () => {
  const canvas = canvasRef.value;

  if (!canvas) return;

  /**
   * Scene
   */
  scene = new THREE.Scene();

  /**
   * Object
   */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  /**
   * Camera
   */
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  scene.add(camera);

  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
};

const cleanUpScene = () => {
  renderer?.dispose();

  scene?.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }
  });

  scene?.clear();
};

onMounted(() => {
  setupScene();
});

onUnmounted(() => {
  cleanUpScene();

  scene = null;
  renderer = null;
  camera = null;
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
