import * as THREE from 'three';

export const useCube = (scene: THREE.Scene) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.x = 0.7;
  cube.position.y = -0.6;
  cube.position.z = 1;

  cube.scale.x = 2;
  cube.scale.y = 0.25;
  cube.scale.z = 0.5;

  cube.rotation.x = Math.PI * 0.25;
  cube.rotation.y = Math.PI * 0.25;

  scene.add(cube);

  return { cube };
};
