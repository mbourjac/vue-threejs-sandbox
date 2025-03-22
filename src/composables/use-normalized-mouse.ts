import { ref, onMounted, onUnmounted } from 'vue';
import { useSizes } from './use-sizes';

export const useNormalizedMouse = () => {
  const { width, height } = useSizes();
  const x = ref(0);
  const y = ref(0);

  const handleMouseMove = (event: MouseEvent) => {
    x.value = event.clientX / width.value - 0.5;
    y.value = -(event.clientY / height.value - 0.5);
  };

  onMounted(() => window.addEventListener('mousemove', handleMouseMove));
  onUnmounted(() => window.removeEventListener('mousemove', handleMouseMove));

  return { x, y };
};
