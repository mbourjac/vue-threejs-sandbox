<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { useGui } from '@/composables/use-gui';
import { useWindowSize } from '@/composables/use-window-size';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();
const { height } = useWindowSize();

let scrollY = window.scrollY;

const handleScroll = () => {
  scrollY = window.scrollY;
};

useThree({
  canvasRef,
  useFullScreen: true,
  setupScene: ({ scene, renderer, animate, camera }) => {
    /**
     * Debug
     */
    const parameters = {
      materialColor: '#ffeded',
      objectsDistance: 4,
    };

    /**
     * Objects
     */
    // Texture
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load('textures/gradients/3.jpg');

    gradientTexture.magFilter = THREE.NearestFilter;

    // Material
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture,
    });

    // Meshes
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );

    mesh1.position.y = -parameters.objectsDistance * 0;
    mesh2.position.y = -parameters.objectsDistance * 1;
    mesh3.position.y = -parameters.objectsDistance * 2;

    const sectionMeshes = [mesh1, mesh2, mesh3];

    scene.add(mesh1, mesh2, mesh3);

    // Debug
    gui.addColor(parameters, 'materialColor').onChange(() => {
      material.color.set(parameters.materialColor);
    });

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3);

    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    /**
     * Camera
     */
    camera.fov = 35;
    camera.updateProjectionMatrix();
    camera.position.z = 6;

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      tick: (elapsedTime) => {
        // Animate meshes
        for (const mesh of sectionMeshes) {
          mesh.rotation.x = elapsedTime * 0.1;
          mesh.rotation.y = elapsedTime * 0.12;
        }

        // Animate camera
        camera.position.y =
          (-scrollY / height.value) * parameters.objectsDistance;
      },
    });
  },
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <canvas ref="canvas" class="fixed left-0 top-0"></canvas>
  <section
    class="relative flex h-screen items-center px-[10%] text-[12vmin] font-bold uppercase text-[#ffeded]"
  >
    <h1>My Portfolio</h1>
  </section>
  <section
    class="relative flex h-screen items-center justify-end px-[10%] text-[12vmin] font-bold uppercase text-[#ffeded]"
  >
    <h2>My projects</h2>
  </section>
  <section
    class="relative flex h-screen items-center px-[10%] text-[12vmin] font-bold uppercase text-[#ffeded]"
  >
    <h2>Contact me</h2>
  </section>
</template>
