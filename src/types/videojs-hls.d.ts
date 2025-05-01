import 'video.js';

declare module 'video.js' {
  export interface Player {
    hlsQualitySelector?: (options?: { displayCurrentQuality: boolean }) => void;
  }
}
