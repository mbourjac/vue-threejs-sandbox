import * as THREE from 'three';

export const createCube = (scene: THREE.Scene) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);

  const animateCube = (elapsedTime: number) => {
    cube.rotation.y = elapsedTime;
  };

  scene.add(cube);

  return { cube, animateCube };
};
