import * as THREE from 'three';
import { onUnmounted } from 'vue';

type UseSceneCleanupArgs = {
  scene: THREE.Scene | null;
  renderer: THREE.WebGLRenderer | null;
};

export const useSceneCleanup = ({ scene, renderer }: UseSceneCleanupArgs) => {
  const cleanUpScene = ({ scene, renderer }: UseSceneCleanupArgs) => {
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
  };

  onUnmounted(() => {
    cleanUpScene({ scene, renderer });
  });
};
