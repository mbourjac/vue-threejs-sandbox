import * as THREE from 'three';

export const createBoxesGroup = (scene: THREE.Scene) => {
  const group = new THREE.Group();

  group.scale.y = 2;
  group.rotation.y = 0.2;

  scene.add(group);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  const cube1 = new THREE.Mesh(geometry, material);
  const cube2 = new THREE.Mesh(geometry, material);
  const cube3 = new THREE.Mesh(geometry, material);

  cube1.position.x = -1.5;
  cube2.position.x = 0;
  cube3.position.x = 1.5;

  group.add(cube1);
  group.add(cube2);
  group.add(cube3);
};
