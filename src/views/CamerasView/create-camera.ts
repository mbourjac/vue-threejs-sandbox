import * as THREE from 'three';
import type { Sizes } from '@/types';

export const createCamera = (
  scene: THREE.Scene,
  mesh: THREE.Mesh,
  sizes: Sizes
) => {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 2;

  camera.lookAt(mesh.position);

  scene.add(camera);

  return { camera };
};
