import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onUnmounted } from 'vue';

export const useOrbitControls = () => {
  let controls: OrbitControls | null = null;

  const setupOrbitControls = (
    camera: THREE.Camera,
    canvas: HTMLCanvasElement
  ) => {
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    return controls;
  };

  onUnmounted(() => {
    controls?.dispose();
    controls = null;
  });

  return { setupOrbitControls };
};
