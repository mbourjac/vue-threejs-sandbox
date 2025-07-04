<script setup lang="ts">
import { onUnmounted, useTemplateRef } from 'vue';
import { useThree } from '@/composables/use-three';
import * as THREE from 'three';
import fireworkVertexShader from './shaders/firework/vertex.glsl';
import fireworkFragmentShader from './shaders/firework/fragment.glsl';
import gsap from 'gsap';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

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

    const createRandomFirework = () => {
      const pointsCount = Math.round(400 + Math.random() * 1000);
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random(),
        (Math.random() - 0.5) * 2
      );
      const pointsSize = 0.1 + Math.random() * 0.1;
      const radius = 0.5 + Math.random();
      const color = new THREE.Color();
      const texture = textures[Math.floor(Math.random() * textures.length)];

      color.setHSL(Math.random(), 1, 0.7);

      createFirework({
        pointsCount,
        position,
        pointsSize,
        texture,
        radius,
        color,
      });
    };

    createRandomFirework();

    /**
     * Click event
     */
    window.addEventListener('click', createRandomFirework);

    onUnmounted(() => {
      window.removeEventListener('click', createRandomFirework);
    });

    /**
     * Sky
     */
    const sky = new Sky();

    sky.scale.setScalar(450000);
    scene.add(sky);

    const sun = new THREE.Vector3();

    // GUI
    const skyController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.95,
      elevation: -2.2,
      azimuth: 180,
      exposure: renderer.toneMappingExposure,
    };

    const updateSky = () => {
      const uniforms = sky.material.uniforms;
      uniforms['turbidity'].value = skyController.turbidity;
      uniforms['rayleigh'].value = skyController.rayleigh;
      uniforms['mieCoefficient'].value = skyController.mieCoefficient;
      uniforms['mieDirectionalG'].value = skyController.mieDirectionalG;

      const phi = THREE.MathUtils.degToRad(90 - skyController.elevation);
      const theta = THREE.MathUtils.degToRad(skyController.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      uniforms['sunPosition'].value.copy(sun);

      renderer.toneMappingExposure = skyController.exposure;
      renderer.render(scene, camera);
    };

    gui.add(skyController, 'turbidity', 0.0, 20.0, 0.1).onChange(updateSky);
    gui.add(skyController, 'rayleigh', 0.0, 4, 0.001).onChange(updateSky);
    gui
      .add(skyController, 'mieCoefficient', 0.0, 0.1, 0.001)
      .onChange(updateSky);
    gui
      .add(skyController, 'mieDirectionalG', 0.0, 1, 0.001)
      .onChange(updateSky);
    gui.add(skyController, 'elevation', -3, 10, 0.01).onChange(updateSky);
    gui.add(skyController, 'azimuth', -180, 180, 0.1).onChange(updateSky);
    gui.add(skyController, 'exposure', 0, 1, 0.0001).onChange(updateSky);

    updateSky();

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
