import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onUnmounted } from 'vue';

export const useAnimateScene = () => {
  const clock = new THREE.Clock();
  let animationFrameId: number | null = null;

  const animate = ({
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
      animate({
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

  return { animate };
};
