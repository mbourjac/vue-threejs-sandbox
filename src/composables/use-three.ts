import { onMounted, type Ref } from 'vue';
import { useAnimateScene } from './use-animate-scene';
import { useOrbitControls } from './use-orbit-controls';
import { useScene } from './use-scene';
import { useWindowSize } from './use-window-size';
import { useResizeScene } from './use-resize-scene';
import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useFullscreenScene } from './use-fullscreen-scene';

export const useThree = ({
  canvasRef,
  useControls = true,
  useFullScreen,
  setupScene,
}: {
  canvasRef: Ref<HTMLCanvasElement | null>;
  useControls?: boolean;
  useFullScreen?: boolean;
  setupScene: ({
    scene,
    renderer,
    camera,
    controls,
    animate,
  }: {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls?: OrbitControls;
    animate: ({
      scene,
      renderer,
      camera,
      controls,
      tick,
    }: {
      scene: THREE.Scene;
      renderer: THREE.WebGLRenderer;
      camera: THREE.Camera;
      controls?: OrbitControls;
      tick?: (elapsedTime: number) => void;
    }) => void;
  }) => void;
}) => {
  const { width, height, aspectRatio } = useWindowSize();
  const { scene, setupRenderer } = useScene();
  const { animate } = useAnimateScene();
  const { setupOrbitControls } = useOrbitControls();

  if (useFullScreen) {
    useFullscreenScene(canvasRef);
  }

  onMounted(() => {
    const canvas = canvasRef.value;

    if (!canvas) return;

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio.value, 0.1, 100);

    scene.add(camera);

    // Controls
    let controls: OrbitControls | undefined;

    if (useControls) {
      controls = setupOrbitControls(camera, canvas);
    }

    /**
     * Renderer
     */
    const { renderer } = setupRenderer(canvas, { width, height });

    /**
     * Resize
     */
    useResizeScene({ camera, renderer, sizes: { width, height } });

    setupScene({ scene, renderer, animate, controls, camera });
  });
};
