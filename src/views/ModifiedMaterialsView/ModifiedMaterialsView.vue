<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useThree } from '@/composables/use-three';

const canvasRef = useTemplateRef('canvas');

useThree({
  canvasRef,
  rendererParameters: {
    antialias: true,
  },
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const textureLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    /**
     * Environment map
     */
    const environmentMap = cubeTextureLoader.load([
      '/environmentMaps/0/px.png',
      '/environmentMaps/0/nx.png',
      '/environmentMaps/0/py.png',
      '/environmentMaps/0/ny.png',
      '/environmentMaps/0/pz.png',
      '/environmentMaps/0/nz.png',
    ]);

    scene.background = environmentMap;
    scene.environment = environmentMap;

    /**
     * Material
     */

    // Textures
    const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg');
    mapTexture.colorSpace = THREE.SRGBColorSpace;
    const normalTexture = textureLoader.load(
      '/models/LeePerrySmith/normal.jpg'
    );

    // Material
    const material = new THREE.MeshStandardMaterial({
      map: mapTexture,
      normalMap: normalTexture,
    });

    const depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
    });

    const customUniforms = {
      uTime: { value: 0 },
    };

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.uTime;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>

        uniform float uTime;

        mat2 get2dRotateMatrix(float _angle)
        {
            return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
        }
      `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>

        float angle = (position.y + uTime) * 0.9;
        mat2 rotateMatrix = get2dRotateMatrix(angle);

        objectNormal.xz = rotateMatrix * objectNormal.xz;
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>

        transformed.xz = rotateMatrix * transformed.xz;
        `
      );
    };

    depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.uTime;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>

        uniform float uTime;

        mat2 get2dRotateMatrix(float _angle)
        {
            return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
        }
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>

        float angle = (position.y + uTime) * 0.9;
        mat2 rotateMatrix = get2dRotateMatrix(angle);

        transformed.xz = rotateMatrix * transformed.xz;
        `
      );
    };

    /**
     * Plane
     */
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15, 15),
      new THREE.MeshStandardMaterial()
    );
    plane.rotation.y = Math.PI;
    plane.position.y = -5;
    plane.position.z = 5;
    scene.add(plane);

    /**
     * Models
     */

    const updateAllMaterials = () => {
      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    };

    gltfLoader.load('/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
      // Model
      const mesh = gltf.scene.children[0] as THREE.Mesh;

      mesh.rotation.y = Math.PI * 0.5;

      mesh.material = material; // Update the material
      mesh.customDepthMaterial = depthMaterial; // Update the depth material

      scene.add(mesh);

      // Update materials
      updateAllMaterials();
    });

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
     * Camera
     */
    camera.position.set(4, 1, -4);

    /**
     * Renderer
     */

    // Shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Tone mapping
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
        customUniforms.uTime.value = elapsedTime;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
