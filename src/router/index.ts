import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    linkLabel: 'Home',
  },
  {
    path: '/first-scene',
    name: 'first-scene',
    component: () => import('../views/FirstSceneView.vue'),
    linkLabel: 'First Scene',
  },
  {
    path: '/object-transformation',
    name: 'object-transformation',
    component: () =>
      import('../views/ObjectTransformationView/ObjectTransformationView.vue'),
    linkLabel: 'Object Transformation',
  },
  {
    path: '/animations',
    name: 'animations',
    component: () => import('../views/AnimationsView/AnimationsView.vue'),
    linkLabel: 'Animations',
  },
  {
    path: '/cameras',
    name: 'cameras',
    component: () => import('../views/CamerasView/CamerasView.vue'),
    linkLabel: 'Cameras',
  },
  {
    path: '/resize',
    name: 'resize',
    component: () => import('../views/ResizeView.vue'),
    linkLabel: 'Resize',
  },
  {
    path: '/geometries',
    name: 'geometries',
    component: () => import('../views/GeometriesView.vue'),
    linkLabel: 'Geometries',
  },
  {
    path: '/debug-ui',
    name: 'debug-ui',
    component: () => import('../views/DebugUIView.vue'),
    linkLabel: 'Debug UI',
  },
  {
    path: '/textures',
    name: 'textures',
    component: () => import('../views/TexturesView.vue'),
    linkLabel: 'Textures',
  },
  {
    path: '/materials',
    name: 'materials',
    component: () => import('../views/MaterialsView.vue'),
    linkLabel: 'Materials',
  },
  {
    path: '/3d-text',
    name: '3d-text',
    component: () => import('../views/3DTextView.vue'),
    linkLabel: '3D Text',
  },
  {
    path: '/lights',
    name: 'lights',
    component: () => import('../views/LightsView.vue'),
    linkLabel: 'Lights',
  },
  {
    path: '/shadows',
    name: 'shadows',
    component: () => import('../views/ShadowsView.vue'),
    linkLabel: 'Shadows',
  },
  {
    path: '/haunted-house',
    name: 'haunted-house',
    component: () => import('../views/HauntedHouseView.vue'),
    linkLabel: 'Haunted House',
  },
  {
    path: '/particles',
    name: 'particles',
    component: () => import('../views/ParticlesView.vue'),
    linkLabel: 'Particles',
  },
  {
    path: '/galaxy-generator',
    name: 'galaxy-generator',
    component: () => import('../views/GalaxyGeneratorView.vue'),
    linkLabel: 'Galaxy Generator',
  },
  {
    path: '/scroll-based-animation',
    name: 'scroll-based-animation',
    component: () => import('../views/ScrollBasedAnimationView.vue'),
    linkLabel: 'Scroll Based Animation',
  },
  {
    path: '/physics',
    name: 'physics',
    component: () => import('../views/PhysicsView.vue'),
    linkLabel: 'Physics',
  },
  {
    path: '/imported-models',
    name: 'imported-models',
    component: () => import('../views/ImportedModelsView.vue'),
    linkLabel: 'Imported Models',
  },
  {
    path: '/raycaster',
    name: 'raycaster',
    component: () => import('../views/RaycasterView.vue'),
    linkLabel: 'Raycaster',
  },
  {
    path: '/environment-map',
    name: 'environment-map',
    component: () => import('../views/EnvironmentMapView.vue'),
    linkLabel: 'Environment Map',
  },
  {
    path: '/realistic-render',
    name: 'realistic-render',
    component: () => import('../views/RealisticRenderView.vue'),
    linkLabel: 'Realistic Render',
  },
  {
    path: '/shaders',
    name: 'shaders',
    component: () => import('../views/ShadersView/ShadersView.vue'),
    linkLabel: 'Shaders',
  },
  {
    path: '/shader-patterns',
    name: 'shader-patterns',
    component: () =>
      import('../views/ShaderPatternsView/ShaderPatternsView.vue'),
    linkLabel: 'Shader Patterns',
  },
  {
    path: '/raging-sea',
    name: 'raging-sea',
    component: () => import('../views/RagingSeaView/RagingSeaView.vue'),
    linkLabel: 'Raging Sea',
  },
  {
    path: '/animated-galaxy',
    name: 'animated-galaxy',
    component: () =>
      import('../views/AnimatedGalaxyView/AnimatedGalaxyView.vue'),
    linkLabel: 'Animated Galaxy',
  },
  {
    path: '/modified-materials',
    name: 'modified-materials',
    component: () =>
      import('../views/ModifiedMaterialsView/ModifiedMaterialsView.vue'),
    linkLabel: 'Modified Materials',
  },
  {
    path: '/coffee-smoke-shader',
    name: 'coffee-smoke-shader',
    component: () =>
      import('../views/CoffeeSmokeShaderView/CoffeeSmokeShaderView.vue'),
    linkLabel: 'Coffee Smoke Shader',
  },
  {
    path: '/hologram',
    name: 'hologram',
    component: () => import('../views/HologramView/HologramView.vue'),
    linkLabel: 'Hologram',
  },
  {
    path: '/fireworks-shader',
    name: 'fireworks-shader',
    component: () =>
      import('../views/FireworksShaderView/FireworksShaderView.vue'),
    linkLabel: 'Fireworks Shader',
  },
  {
    path: '/lights-shading',
    name: 'lights-shading',
    component: () => import('../views/LightsShadingView/LightsShadingView.vue'),
    linkLabel: 'Lights Shading',
  },
  {
    path: '/raging-sea-shading',
    name: 'raging-sea-shading',
    component: () =>
      import('../views/RagingSeaShadingView/RagingSeaShadingView.vue'),
    linkLabel: 'Raging Sea Shading',
  },
  {
    path: '/halftone-shading',
    name: 'halftone-shading',
    component: () =>
      import('../views/HalftoneShadingView/HalftoneShadingView.vue'),
    linkLabel: 'Halftone Shading',
  },
  {
    path: '/earth',
    name: 'earth',
    component: () => import('../views/EarthView/EarthView.vue'),
    linkLabel: 'Earth',
  },
  {
    path: '/particles-cursor-animation',
    name: 'particles-cursor-animation',
    component: () =>
      import(
        '../views/ParticlesCursorAnimationShaderView/ParticlesCursorAnimationShaderView.vue'
      ),
    linkLabel: 'Particles Cursor Animation Shader',
  },
  {
    path: '/particles-morphing-shader',
    name: 'particles-morphing-shader',
    component: () =>
      import(
        '../views/ParticlesMorphingShaderView/ParticlesMorphingShaderView.vue'
      ),
    linkLabel: 'Particles Morphing Shader',
  },
  {
    path: '/gpgpu-flow-field-particles',
    name: 'gpgpu-flow-field-particles',
    component: () =>
      import(
        '../views/GPGPUFlowFieldParticlesView/GPGPUFlowFieldParticlesView.vue'
      ),
    linkLabel: 'GPGPU Flow Field Particles',
  },
  {
    path: '/wobbly-sphere',
    name: 'Wobbly sphere',
    component: () => import('../views/WobblySphereView/WobblySphereView.vue'),
    linkLabel: 'Wobbly Sphere',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes.map(({ linkLabel: _, ...rest }) => rest),
});

export default router;
