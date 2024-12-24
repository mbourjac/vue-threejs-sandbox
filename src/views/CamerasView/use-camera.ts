import * as THREE from 'three';
import type { Sizes } from '@/types';

export const useCamera = ({
  scene,
  mesh,
  sizes,
}: {
  scene: THREE.Scene;
  mesh: THREE.Mesh;
  sizes: Sizes;
}) => {
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width.value / sizes.height.value,
    1,
    1000
  );

  camera.position.z = 3;
  camera.lookAt(mesh.position);

  scene.add(camera);

  return { camera };
};
