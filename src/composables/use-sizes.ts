import { ref, onMounted, onUnmounted, computed, watchEffect } from 'vue';
import * as THREE from 'three';

export const useSizes = () => {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);
  const pixelRatio = ref(Math.min(window.devicePixelRatio, 2));
  const resolution = ref(
    new THREE.Vector2(
      width.value * pixelRatio.value,
      height.value * pixelRatio.value
    )
  );
  const aspectRatio = computed(() => width.value / height.value);

  const handleWindowResize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    pixelRatio.value = Math.min(window.devicePixelRatio, 2);
  };

  watchEffect(() => {
    resolution.value.set(
      width.value * pixelRatio.value,
      height.value * pixelRatio.value
    );
  });

  onMounted(() => window.addEventListener('resize', handleWindowResize));
  onUnmounted(() => window.removeEventListener('resize', handleWindowResize));

  return { width, height, aspectRatio, resolution, pixelRatio };
};
