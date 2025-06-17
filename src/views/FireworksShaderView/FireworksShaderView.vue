<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useThree } from '@/composables/use-three';
import * as THREE from 'three';
import fireworkVertexShader from './shaders/firework/vertex.glsl';
import fireworkFragmentShader from './shaders/firework/fragment.glsl';

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

    const createFirework = (
      pointsCount: number,
      pointsSize: number,
      position: THREE.Vector3,
      texture: THREE.Texture
    ) => {
      // Geometry
      const positionsArray = new Float32Array(pointsCount * 3);
      const sizesArray = new Float32Array(pointsCount);

      for (let i = 0; i < pointsCount; i++) {
        const i3 = i * 3;

        positionsArray[i3] = Math.random() - 0.5;
        positionsArray[i3 + 1] = Math.random() - 0.5;
        positionsArray[i3 + 2] = Math.random() - 0.5;

        sizesArray[i] = Math.random();
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

      // Material
      texture.flipY = false;

      const material = new THREE.ShaderMaterial({
        vertexShader: fireworkVertexShader,
        fragmentShader: fireworkFragmentShader,
        uniforms: {
          uSize: new THREE.Uniform(pointsSize),
          uResolution: new THREE.Uniform(sizes.resolution.value),
          uTexture: new THREE.Uniform(texture),
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      // Points
      const firework = new THREE.Points(geometry, material);

      firework.position.copy(position);
      scene.add(firework);
    };

    createFirework(100, 0.5, new THREE.Vector3(), textures[1]);

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
