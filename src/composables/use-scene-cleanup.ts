import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onUnmounted } from 'vue';

type UseSceneCleanupArgs = {
  scene: THREE.Scene | null;
  renderer: THREE.WebGLRenderer | null;
  controls?: OrbitControls | null;
};

export const useSceneCleanup = ({
  scene,
  renderer,
  controls,
}: UseSceneCleanupArgs) => {
  const cleanUpScene = ({ scene, renderer, controls }: UseSceneCleanupArgs) => {
    renderer?.dispose();

    scene?.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    scene?.clear();

    controls?.dispose();
  };

  onUnmounted(() => {
    cleanUpScene({ scene, renderer, controls });
  });
};
