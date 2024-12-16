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
    component: () => import('../views/ObjectTransformationView.vue'),
    linkLabel: 'Object Transformation',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes.map(({ linkLabel: _, ...rest }) => rest),
});

export default router;
