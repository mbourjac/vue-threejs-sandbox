import * as THREE from 'three';
import { onUnmounted } from 'vue';

export const useSceneAnimation = () => {
  let animationFrameId: number | null = null;
  const clock = new THREE.Clock();

  const animateScene = ({
    scene,
    renderer,
    camera,
    tick,
  }: {
    scene: THREE.Scene | null;
    renderer: THREE.WebGLRenderer | null;
    camera: THREE.Camera | null;
    tick?: (elapsedTime: number) => void;
  }) => {
    if (!renderer || !scene || !camera) return;

    const elapsedTime = clock.getElapsedTime();

    if (tick) {
      tick(elapsedTime);
    }

    // Render
    renderer.render(scene, camera);

    animationFrameId = window.requestAnimationFrame(() =>
      animateScene({
        scene,
        renderer,
        camera,
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
