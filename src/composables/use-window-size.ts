import { ref, onMounted, onUnmounted, computed } from 'vue';

export const useWindowSize = () => {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);
  const aspectRatio = computed(() => width.value / height.value);

  const handleWindowResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => window.addEventListener('resize', handleWindowResize));
  onUnmounted(() => window.removeEventListener('resize', handleWindowResize));

  return { width, height, aspectRatio };
};
