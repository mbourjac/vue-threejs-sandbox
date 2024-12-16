import * as THREE from 'three';

export const createBox = (scene: THREE.Scene) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = 0.7;
  mesh.position.y = -0.6;
  mesh.position.z = 1;

  mesh.scale.x = 2;
  mesh.scale.y = 0.25;
  mesh.scale.z = 0.5;

  mesh.rotation.x = Math.PI * 0.25;
  mesh.rotation.y = Math.PI * 0.25;

  scene.add(mesh);

  return { mesh };
};
