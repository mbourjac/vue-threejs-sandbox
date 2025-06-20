<script setup lang="ts">
import { onUnmounted, useTemplateRef } from 'vue';
import { useThree } from '@/composables/use-three';
import * as THREE from 'three';
import fireworkVertexShader from './shaders/firework/vertex.glsl';
import fireworkFragmentShader from './shaders/firework/fragment.glsl';
import gsap from 'gsap';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  rendererParameters: {
    antialias: true,
  },
  setupScene: ({ scene, renderer, animate, controls, camera, sizes }) => {
    /**
     * Camera
     */
    camera.position.set(1.5, 0, 6);
    camera.fov = 25;
    camera.updateProjectionMatrix();

    /**
     * Fireworks
     */
    // Textures
    const textureLoader = new THREE.TextureLoader();
    const textures = [
      textureLoader.load('./textures/particles/1.png'),
      textureLoader.load('./textures/particles/2.png'),
      textureLoader.load('./textures/particles/3.png'),
      textureLoader.load('./textures/particles/4.png'),
      textureLoader.load('./textures/particles/5.png'),
      textureLoader.load('./textures/particles/6.png'),
      textureLoader.load('./textures/particles/7.png'),
      textureLoader.load('./textures/particles/8.png'),
    ];

    const createFirework = ({
      pointsCount,
      pointsSize,
      position,
      texture,
      radius,
      color,
    }: {
      pointsCount: number;
      pointsSize: number;
      position: THREE.Vector3;
      texture: THREE.Texture;
      radius: number;
      color: THREE.Color;
    }) => {
      // Geometry
      const positionsArray = new Float32Array(pointsCount * 3);
      const sizesArray = new Float32Array(pointsCount);
      const timeMultiplierArray = new Float32Array(pointsCount);

      for (let i = 0; i < pointsCount; i++) {
        const i3 = i * 3;

        const spherical = new THREE.Spherical(
          radius * (0.75 + Math.random() * 0.25),
          Math.random() * Math.PI,
          Math.random() * Math.PI * 2
        );
        const position = new THREE.Vector3();

        position.setFromSpherical(spherical);

        positionsArray[i3] = position.x;
        positionsArray[i3 + 1] = position.y;
        positionsArray[i3 + 2] = position.z;

        sizesArray[i] = Math.random();

        timeMultiplierArray[i] = 1 + Math.random();
      }

      const geometry = new THREE.BufferGeometry();

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positionsArray, 3)
      );
      geometry.setAttribute(
        'aSize',
        new THREE.Float32BufferAttribute(sizesArray, 1)
      );
      geometry.setAttribute(
        'aTimeMultiplier',
        new THREE.Float32BufferAttribute(timeMultiplierArray, 1)
      );

      // Material
      texture.flipY = false;

      const material = new THREE.ShaderMaterial({
        vertexShader: fireworkVertexShader,
        fragmentShader: fireworkFragmentShader,
        uniforms: {
          uSize: new THREE.Uniform(pointsSize),
          uResolution: new THREE.Uniform(sizes.resolution.value),
          uTexture: new THREE.Uniform(texture),
          uColor: new THREE.Uniform(color),
          uProgress: new THREE.Uniform(0),
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      // Points
      const firework = new THREE.Points(geometry, material);

      firework.position.copy(position);
      scene.add(firework);

      // Destroy
      const destroy = () => {
        scene.remove(firework);
        geometry.dispose();
        material.dispose();
      };

      // Animate
      gsap.to(material.uniforms.uProgress, {
        value: 1,
        duration: 3,
        ease: 'linear',
        onComplete: destroy,
      });
    };

    createFirework({
      pointsCount: 100,
      pointsSize: 0.5,
      position: new THREE.Vector3(),
      texture: textures[1],
      radius: 1,
      color: new THREE.Color('#8affff'),
    });

    /**
     * Click event
     */
    const handleClick = () => {
      createFirework({
        pointsCount: 100,
        pointsSize: 0.5,
        position: new THREE.Vector3(),
        texture: textures[1],
        radius: 1,
        color: new THREE.Color('#8affff'),
      });
    };

    window.addEventListener('click', handleClick);

    onUnmounted(() => {
      window.removeEventListener('click', handleClick);
    });

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
