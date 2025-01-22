import GUI from 'lil-gui';
import { onUnmounted, onMounted } from 'vue';

export const useGui = (options?: {
  autoPlace?: boolean;
  container?: HTMLElement;
  width?: number;
  title?: string;
  closeFolders?: boolean;
  injectStyles?: boolean;
  touchStyles?: number;
  parent?: GUI;
}) => {
  const gui = new GUI(options);

  const toggleGui = (event: KeyboardEvent) => {
    if (event.key === 'h') {
      gui.show(gui._hidden);
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', toggleGui);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', toggleGui);
    gui.destroy();
  });

  return { gui };
};
