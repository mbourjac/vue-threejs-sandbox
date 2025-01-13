import { onMounted, onUnmounted, type Ref } from 'vue';

export const useFullscreenScene = (
  canvasRef: Ref<HTMLCanvasElement | null>
) => {
  const handleDoubleClick = () => {
    const canvas = canvasRef.value;

    if (!canvas) return;

    if (!document.fullscreenElement) {
      canvas.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  onMounted(() => {
    window.addEventListener('dblclick', handleDoubleClick);
  });

  onUnmounted(() => {
    window.removeEventListener('dblclick', handleDoubleClick);
  });
};
