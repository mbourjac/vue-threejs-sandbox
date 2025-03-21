<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGui } from '@/composables/use-gui';
import { useThree } from '@/composables/use-three';
import { useNormalizedMouse } from '@/composables/use-normalized-mouse';
import { useSizes } from '@/composables/use-sizes';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();
const { height } = useSizes();
const { x, y } = useNormalizedMouse();

let scrollY = window.scrollY;
let currentSection = 0;
let sectionMeshes: THREE.Mesh[] = [];

const handleScroll = () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / height.value);

  if (newSection !== currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=1.5',
    });
  }
};

useThree({
  canvasRef,
  useControls: false,
  setupScene: ({ scene, renderer, animate, camera, sizes: { height } }) => {
    /**
     * Debug
     */
    const parameters = {
      materialColor: '#ffeded',
      objectsDistance: 4,
      particlesCount: 200,
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

    mesh1.position.x = 2;
    mesh2.position.x = -2;
    mesh3.position.x = 2;

    sectionMeshes = [mesh1, mesh2, mesh3];

    scene.add(mesh1, mesh2, mesh3);

    // Debug
    gui.addColor(parameters, 'materialColor').onChange(() => {
      material.color.set(parameters.materialColor);
    });

    /**
     * Particles
     */
    // Geometry
    const positions = new Float32Array(parameters.particlesCount * 3);

    for (let i = 0; i < parameters.particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] =
        parameters.objectsDistance * 0.5 -
        Math.random() * parameters.objectsDistance * sectionMeshes.length;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      sizeAttenuation: true,
      size: 0.03,
    });

    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    gui.addColor(parameters, 'materialColor').onChange(() => {
      material.color.set(parameters.materialColor);
      particlesMaterial.color.set(parameters.materialColor);
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

    const cameraGroup = new THREE.Group();

    scene.add(cameraGroup);
    scene.remove(camera);
    cameraGroup.add(camera);

    /**
     * Animate
     */
    let previousTime = 0;

    animate({
      scene,
      renderer,
      camera,
      tick: (elapsedTime) => {
        const deltaTime = elapsedTime - previousTime;

        previousTime = elapsedTime;

        // Animate meshes
        for (const mesh of sectionMeshes) {
          mesh.rotation.x += deltaTime * 0.1;
          mesh.rotation.y += deltaTime * 0.12;
        }

        // Animate camera
        camera.position.y =
          (-scrollY / height.value) * parameters.objectsDistance;

        const parallaxX = x.value * 0.5;
        const parallaxY = -y.value * 0.5;

        cameraGroup.position.x +=
          (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
        cameraGroup.position.y +=
          (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
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
