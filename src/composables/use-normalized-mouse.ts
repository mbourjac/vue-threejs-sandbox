import { ref, onMounted, onUnmounted } from 'vue';
import type { Sizes } from '@/types';

export const useNormalizedMouse = (sizes: Sizes) => {
  const x = ref(0);
  const y = ref(0);

  const handleMouseMove = (event: MouseEvent) => {
    x.value = event.clientX / sizes.width.value - 0.5;
    y.value = -(event.clientY / sizes.height.value - 0.5);
  };

  onMounted(() => window.addEventListener('mousemove', handleMouseMove));
  onUnmounted(() => window.removeEventListener('mousemove', handleMouseMove));

  return { x, y };
};
