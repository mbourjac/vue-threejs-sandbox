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
  const aspectRatio = sizes.width / sizes.height;
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 1000);

  camera.position.z = 3;
  camera.lookAt(mesh.position);

  scene.add(camera);

  return { camera };
};
