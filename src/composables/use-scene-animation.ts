import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onUnmounted } from 'vue';

export const useSceneAnimation = () => {
  const clock = new THREE.Clock();
  let animationFrameId: number | null = null;

  const animateScene = ({
    scene,
    renderer,
    camera,
    controls,
    tick,
  }: {
    scene: THREE.Scene | null;
    renderer: THREE.WebGLRenderer | null;
    camera: THREE.Camera | null;
    controls?: OrbitControls;
    tick?: (elapsedTime: number) => void;
  }) => {
    if (!renderer || !scene || !camera) return;

    const elapsedTime = clock.getElapsedTime();

    if (tick) {
      tick(elapsedTime);
    }

    // Update controls
    controls?.update();

    // Render
    renderer.render(scene, camera);

    animationFrameId = window.requestAnimationFrame(() =>
      animateScene({
        scene,
        renderer,
        camera,
        controls,
        tick,
      })
    );
  };

  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  return { animateScene };
};
