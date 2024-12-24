import * as THREE from 'three';
import type { Sizes } from '@/types';

export const useCamera = (scene: THREE.Scene, sizes: Sizes) => {
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width.value / sizes.height.value
  );

  camera.position.z = 3;

  scene.add(camera);

  const animateCamera = (elapsedTime: number, mesh: THREE.Mesh) => {
    camera.position.x = Math.cos(elapsedTime);
    camera.position.y = Math.sin(elapsedTime);
    camera.lookAt(mesh.position);
  };

  return { camera, animateCamera };
};
