import * as THREE from 'three';
import type { Sizes } from '@/types';

export const createCamera = (
  scene: THREE.Scene,
  mesh: THREE.Mesh,
  sizes: Sizes
) => {
  const aspectRatio = sizes.width / sizes.height;
  const camera = new THREE.OrthographicCamera(
    -1 * aspectRatio,
    1 * aspectRatio,
    1,
    -1,
    0.1,
    100
  );

  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 2;

  camera.lookAt(mesh.position);

  scene.add(camera);

  return { camera };
};
