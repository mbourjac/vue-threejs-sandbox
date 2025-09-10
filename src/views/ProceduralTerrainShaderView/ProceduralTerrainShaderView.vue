<script setup lang="ts">
import { useTemplateRef } from 'vue';
import * as THREE from 'three';
import { useThree } from '@/composables/use-three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import terrainVertexShader from './shaders/terrain/vertex.glsl';
import terrainFragmentShader from './shaders/terrain/fragment.glsl';
import { useGui } from '@/composables/use-gui';

const canvasRef = useTemplateRef('canvas');

const { gui } = useGui();

useThree({
  canvasRef,
  setupScene: ({ scene, renderer, animate, controls, camera }) => {
    /**
     * Loaders
     */
    const rgbeLoader = new RGBELoader();

    /**
     * Environment map
     */

    rgbeLoader.load(
      './environmentMaps/spruit_sunrise.hdr',
      (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = environmentMap;
        scene.backgroundBlurriness = 0.5;
        scene.environment = environmentMap;
      }
    );

    /**
     * Terrain
     */
    // Geometry
    const geometry = new THREE.PlaneGeometry(10, 10, 500, 500);

    geometry.deleteAttribute('uv');
    geometry.deleteAttribute('normal');
    geometry.rotateX(-Math.PI * 0.5);

    // Material

    const debug = {
      colorWaterDeep: '#002b3d',
      colorWaterSurface: '#66a8ff',
      colorSand: '#ffe894',
      colorGrass: '#85d534',
      colorSnow: '#ffffff',
      colorRock: '#bfbd8d',
    };

    const uniforms = {
      uTime: new THREE.Uniform(0),
      uPositionFrequency: new THREE.Uniform(0.2),
      uStrength: new THREE.Uniform(2.0),
      uWarpFrequency: new THREE.Uniform(5),
      uWarpStrength: new THREE.Uniform(0.5),
      uColorWaterDeep: new THREE.Uniform(new THREE.Color(debug.colorWaterDeep)),
      uColorWaterSurface: new THREE.Uniform(
        new THREE.Color(debug.colorWaterSurface)
      ),
      uColorSand: new THREE.Uniform(new THREE.Color(debug.colorSand)),
      uColorGrass: new THREE.Uniform(new THREE.Color(debug.colorGrass)),
      uColorSnow: new THREE.Uniform(new THREE.Color(debug.colorSnow)),
      uColorRock: new THREE.Uniform(new THREE.Color(debug.colorRock)),
    };

    gui
      .add(uniforms.uPositionFrequency, 'value', 0, 1, 0.001)
      .name('uPositionFrequency');
    gui.add(uniforms.uStrength, 'value', 0, 10, 0.001).name('uStrength');
    gui
      .add(uniforms.uWarpFrequency, 'value', 0, 10, 0.001)
      .name('uWarpFrequency');
    gui.add(uniforms.uWarpStrength, 'value', 0, 1, 0.001).name('uWarpStrength');

    gui
      .addColor(debug, 'colorWaterDeep')
      .onChange(() => uniforms.uColorWaterDeep.value.set(debug.colorWaterDeep));
    gui
      .addColor(debug, 'colorWaterSurface')
      .onChange(() =>
        uniforms.uColorWaterSurface.value.set(debug.colorWaterSurface)
      );
    gui
      .addColor(debug, 'colorSand')
      .onChange(() => uniforms.uColorSand.value.set(debug.colorSand));
    gui
      .addColor(debug, 'colorGrass')
      .onChange(() => uniforms.uColorGrass.value.set(debug.colorGrass));
    gui
      .addColor(debug, 'colorSnow')
      .onChange(() => uniforms.uColorSnow.value.set(debug.colorSnow));
    gui
      .addColor(debug, 'colorRock')
      .onChange(() => uniforms.uColorRock.value.set(debug.colorRock));

    const material = new CustomShaderMaterial({
      // CSM
      baseMaterial: THREE.MeshStandardMaterial,
      vertexShader: terrainVertexShader,
      fragmentShader: terrainFragmentShader,
      uniforms,

      // MeshStandardMaterial
      metalness: 0,
      roughness: 0.5,
      color: '#85d534',
    });

    const depthMaterial = new CustomShaderMaterial({
      // CSM
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader: terrainVertexShader,
      uniforms: uniforms,

      // MeshDepthMaterial
      depthPacking: THREE.RGBADepthPacking,
    });

    // Mesh
    const terrain = new THREE.Mesh(geometry, material);

    terrain.customDepthMaterial = depthMaterial;
    terrain.receiveShadow = true;
    terrain.castShadow = true;

    scene.add(terrain);

    /**
     * Water
     */
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 1, 1),
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        roughness: 0.3,
      })
    );
    water.rotation.x = -Math.PI * 0.5;
    water.position.y = -0.1;

    scene.add(water);

    scene.add(water);

    /**
     * Board
     */
    // Brushes
    const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11));
    const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10));

    // Evaluate
    const evaluator = new Evaluator();
    const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION);

    board.geometry.clearGroups();
    board.material = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.3,
    });
    board.castShadow = true;
    board.receiveShadow = true;

    scene.add(board);

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 2);

    directionalLight.position.set(6.25, 3, 4);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 30;
    directionalLight.shadow.camera.top = 8;
    directionalLight.shadow.camera.right = 8;
    directionalLight.shadow.camera.bottom = -8;
    directionalLight.shadow.camera.left = -8;

    scene.add(directionalLight);

    /**
     * Camera
     */
    camera.position.set(-10, 6, -2);
    camera.fov = 35;
    camera.updateProjectionMatrix();

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
        // Uniforms
        uniforms.uTime.value = elapsedTime;
      },
    });
  },
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
