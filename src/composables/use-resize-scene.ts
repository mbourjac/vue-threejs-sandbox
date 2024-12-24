import { watchEffect } from 'vue';
import * as THREE from 'three';
import type { Sizes } from '../types';

type UseResizeSceneArgs = {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  sizes: Sizes;
};

export function useResizeScene({
  camera,
  renderer,
  sizes,
}: UseResizeSceneArgs) {
  const updateRenderer = () => {
    renderer.setSize(sizes.width.value, sizes.height.value);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const updateCamera = () => {
    camera.aspect = sizes.width.value / sizes.height.value;
    camera.updateProjectionMatrix();
  };

  watchEffect(updateRenderer);
  watchEffect(updateCamera);
}
