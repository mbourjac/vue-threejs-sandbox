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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes.map(({ linkLabel: _, ...rest }) => rest),
});

export default router;
