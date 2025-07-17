<script setup lang="ts">
import { useTemplateRef, watchEffect } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';
import { useVectorMouse } from '@/composables/use-vector-mouse';

const canvasRef = useTemplateRef('canvas');

const mouse = useVectorMouse(9999, 9999);

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
    displacementCanvas.style.width = '256px';
    displacementCanvas.style.height = '256px';
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

    // Interactive plane
    const interactivePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ color: 'red' })
    );
    interactivePlane.visible = false;

    scene.add(interactivePlane);

    // Raycaster
    const raycaster = new THREE.Raycaster();

    // Coordinates
    const canvasPosition = new THREE.Vector2(9999, 9999);

    // Texture
    const displacementTexture = new THREE.CanvasTexture(displacementCanvas);

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
        uDisplacementTexture: new THREE.Uniform(displacementTexture),
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
      tick: () => {
        /**
         * Raycaster
         */
        raycaster.setFromCamera(mouse, camera);

        const intersections = raycaster.intersectObject(interactivePlane);

        if (!intersections.length) return;

        const uv = intersections[0].uv;

        canvasPosition.x = uv!.x * displacementCanvas.width;
        canvasPosition.y = (1 - uv!.y) * displacementCanvas.height;

        /**
         * Displacement
         */
        if (!displacementContext) return;

        // Fade out
        displacementContext.globalCompositeOperation = 'source-over';
        displacementContext.globalAlpha = 0.02;
        displacementContext.fillRect(
          0,
          0,
          displacementCanvas.width,
          displacementCanvas.height
        );

        // Draw glow
        const glowSize = displacementCanvas.width * 0.25;

        displacementContext.globalCompositeOperation = 'lighten';
        displacementContext.globalAlpha = 1;
        displacementContext.drawImage(
          glowImage,
          canvasPosition.x - glowSize * 0.5,
          canvasPosition.y - glowSize * 0.5,
          glowSize,
          glowSize
        );

        // Texture
        displacementTexture.needsUpdate = true;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
