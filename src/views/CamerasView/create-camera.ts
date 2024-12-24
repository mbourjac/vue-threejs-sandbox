import * as THREE from 'three';
import type { Sizes } from '@/types';
import { computed } from 'vue';

export const createCamera = (
  scene: THREE.Scene,
  mesh: THREE.Mesh,
  sizes: Sizes
) => {
  const aspectRatio = computed(() => sizes.width.value / sizes.height.value);
  const camera = new THREE.OrthographicCamera(
    -1 * aspectRatio.value,
    1 * aspectRatio.value,
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
