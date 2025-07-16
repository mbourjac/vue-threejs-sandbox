<script setup lang="ts">
import { useTemplateRef, watchEffect } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera, sizes }) => {
    /**
     * Camera
     */
    camera.position.set(0, 0, 18);
    camera.fov = 35;
    camera.updateProjectionMatrix();

    /**
     * Renderer
     */
    renderer.setClearColor('#181818');

    /**
     * Displacement
     */
    // 2D canvas
    const displacementCanvas = document.createElement('canvas');

    displacementCanvas.width = 128;
    displacementCanvas.height = 128;

    displacementCanvas.style.position = 'fixed';
    displacementCanvas.style.width = '512px';
    displacementCanvas.style.height = '512px';
    displacementCanvas.style.top = '0';
    displacementCanvas.style.left = '0';
    displacementCanvas.style.zIndex = '10';

    document.body.append(displacementCanvas);

    // Context
    const displacementContext = displacementCanvas.getContext('2d');

    displacementContext!.fillRect(
      0,
      0,
      displacementCanvas.width,
      displacementCanvas.height
    );

    // Glow image
    const glowImage = new Image();
    glowImage.src = './pictures/glow.png';

    /**
     * Particles
     */
    const textureLoader = new THREE.TextureLoader();

    const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            sizes.width.value * sizes.pixelRatio.value,
            sizes.height.value * sizes.pixelRatio.value
          )
        ),
        uPictureTexture: new THREE.Uniform(
          textureLoader.load('./pictures/picture-2.png')
        ),
      },
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);

    scene.add(particles);

    watchEffect(() => {
      particlesMaterial.uniforms.uResolution.value.set(
        sizes.width.value * sizes.pixelRatio.value,
        sizes.height.value * sizes.pixelRatio.value
      );
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
