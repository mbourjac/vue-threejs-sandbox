import * as THREE from 'three';
import { onUnmounted } from 'vue';
import type { Sizes } from '../types';

export const useScene = () => {
  const scene = new THREE.Scene();
  let renderer: THREE.WebGLRenderer | null = null;

  const setupRenderer = (
    canvas: HTMLCanvasElement,
    sizes: Sizes,
    parameters?: THREE.WebGLRendererParameters
  ) => {
    renderer = new THREE.WebGLRenderer({ ...parameters, canvas });
    renderer.setSize(sizes.width.value, sizes.height.value);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return { renderer };
  };

  onUnmounted(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    scene.clear();

    renderer?.dispose();
    renderer = null;
  });

  return { scene, setupRenderer };
};
