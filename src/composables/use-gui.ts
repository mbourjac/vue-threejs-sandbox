import GUI from 'lil-gui';
import { onUnmounted } from 'vue';

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

  onUnmounted(() => {
    gui.destroy();
  });

  return { gui };
};
