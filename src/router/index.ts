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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes.map(({ linkLabel: _, ...rest }) => rest),
});

export default router;
