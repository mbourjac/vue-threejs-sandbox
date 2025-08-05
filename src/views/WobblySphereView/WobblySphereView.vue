<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useThree } from '@/composables/use-three';
import { RGBELoader, DRACOLoader } from 'three/examples/jsm/Addons.js';
import { useGui } from '@/composables/use-gui';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import wobbleVertexShader from './shaders/wobble/vertex.glsl';
import wobbleFragmentShader from './shaders/wobble/fragment.glsl';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  rendererParameters: {
    antialias: true,
  },
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const rgbeLoader = new RGBELoader();
    const dracoLoader = new DRACOLoader();
    const gltfLoader = new GLTFLoader();

    dracoLoader.setDecoderPath('./draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    /**
     * Environment map
     */
    rgbeLoader.load(
      './environmentMaps/urban_alley_01_1k.hdr',
      (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = environmentMap;
      }
    );

    /**
     * Camera
     */
    camera.position.set(13, -3, -5);
    camera.fov = 35;
    camera.updateProjectionMatrix();

    /**
     * Wobbly sphere
     */
    // Material
    const uniforms = {
      uTime: new THREE.Uniform(0),
      uPositionFrequency: new THREE.Uniform(0.5),
      uTimeFrequency: new THREE.Uniform(0.4),
      uStrength: new THREE.Uniform(0.3),
      uWarpPositionFrequency: new THREE.Uniform(0.38),
      uWarpTimeFrequency: new THREE.Uniform(0.12),
      uWarpStrength: new THREE.Uniform(1.7),
    };

    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      // CSM
      vertexShader: wobbleVertexShader,
      fragmentShader: wobbleFragmentShader,

      // MeshPhysicalMaterial
      uniforms: uniforms,
      metalness: 0,
      roughness: 0.5,
      color: '#ffffff',
      transmission: 0,
      ior: 1.5,
      thickness: 1.5,
      transparent: true,
      wireframe: false,
    }) as CustomShaderMaterial & THREE.MeshPhysicalMaterial;

    const depthMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      // CSM
      vertexShader: wobbleVertexShader,

      // MeshDepthMaterial
      uniforms: uniforms,
      depthPacking: THREE.RGBADepthPacking,
    }) as CustomShaderMaterial & THREE.MeshDepthMaterial;

    // Controls
    gui.add(material, 'metalness', 0, 1, 0.001);
    gui.add(material, 'roughness', 0, 1, 0.001);
    gui.add(material, 'transmission', 0, 1, 0.001);
    gui.add(material, 'ior', 0, 10, 0.001);
    gui.add(material, 'thickness', 0, 10, 0.001);
    gui.addColor(material, 'color');

    gui
      .add(uniforms.uPositionFrequency, 'value', 0, 2, 0.001)
      .name('uPositionFrequency');
    gui
      .add(uniforms.uTimeFrequency, 'value', 0, 2, 0.001)
      .name('uTimeFrequency');
    gui.add(uniforms.uStrength, 'value', 0, 2, 0.001).name('uStrength');

    gui
      .add(uniforms.uWarpPositionFrequency, 'value', 0, 2, 0.001)
      .name('uWarpPositionFrequency');
    gui
      .add(uniforms.uWarpTimeFrequency, 'value', 0, 2, 0.001)
      .name('uWarpTimeFrequency');
    gui.add(uniforms.uWarpStrength, 'value', 0, 2, 0.001).name('uWarpStrength');

    // Geometry
    const geometry = new THREE.IcosahedronGeometry(2.5, 50);

    const indexedGeometry = mergeVertices(geometry);
    indexedGeometry.computeTangents();

    // Mesh
    const wobble = new THREE.Mesh(indexedGeometry, material);

    wobble.receiveShadow = true;
    wobble.castShadow = true;

    wobble.customDepthMaterial = depthMaterial;

    scene.add(wobble);

    /**
     * Plane
     */
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15, 15),
      new THREE.MeshStandardMaterial()
    );

    plane.receiveShadow = true;
    plane.rotation.y = Math.PI;
    plane.position.y = -5;
    plane.position.z = 5;

    scene.add(plane);

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3);

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(0.25, 2, -2.25);

    scene.add(directionalLight);

    /**
     * Renderer
     */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    /**
     * Animate
     */
    animate({
      scene,
      renderer,
      camera,
      controls,
      tick: (elapsedTime) => {
        // Materials
        uniforms.uTime.value = elapsedTime;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
