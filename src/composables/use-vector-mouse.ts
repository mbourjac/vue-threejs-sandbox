import * as THREE from 'three';
import { useSizes } from './use-sizes';
import { onMounted, onUnmounted } from 'vue';

export const useVectorMouse = (x?: number, y?: number) => {
  const { width, height } = useSizes();

  const mouse = new THREE.Vector2(x, y);

  const handleMouse = (event: MouseEvent) => {
    mouse.x = (event.clientX / width.value) * 2 - 1;
    mouse.y = -(event.clientY / height.value) * 2 + 1;
  };

  onMounted(() => {
    window.addEventListener('mousemove', handleMouse);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouse);
  });

  return mouse;
};
