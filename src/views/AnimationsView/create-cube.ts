import * as THREE from 'three';

export const createCube = (scene: THREE.Scene) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);

  const animateCube = (elapsedTime: number) => {
    cube.position.x = Math.cos(elapsedTime);
    cube.position.y = Math.sin(elapsedTime);
  };

  scene.add(cube);

  return { cube, animateCube };
};
