import * as THREE from 'three';

export const useAxesHelper = (scene: THREE.Scene, size?: number) => {
  const axesHelper = new THREE.AxesHelper(size);
  scene.add(axesHelper);
};
