import * as THREE from 'three';
import type { Sizes } from '@/types';
import { watchEffect, type Ref } from 'vue';

export const useCamera = ({
  scene,
  mesh,
  sizes,
  mouse,
}: {
  scene: THREE.Scene;
  mesh: THREE.Mesh;
  sizes: Sizes;
  mouse: {
    x: Ref<number>;
    y: Ref<number>;
  };
}) => {
  const aspectRatio = sizes.width / sizes.height;
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 1000);

  camera.position.z = 3;
  camera.lookAt(mesh.position);

  scene.add(camera);

  watchEffect(() => {
    camera.position.x = Math.sin(mouse.x.value * Math.PI * 2) * 2;
    camera.position.z = Math.cos(mouse.x.value * Math.PI * 2) * 2;
    camera.position.y = mouse.y.value * 3;
    camera.lookAt(mesh.position);
  });

  return { camera };
};
