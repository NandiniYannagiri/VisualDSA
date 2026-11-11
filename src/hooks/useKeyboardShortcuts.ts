import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onPlayPause?: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  onReset?: () => void;
}

export function useKeyboardShortcuts({
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is currently typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onPlayPause?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onStepForward?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onStepBackward?.();
          break;
        case 'KeyR':
          e.preventDefault();
          onReset?.();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause, onStepForward, onStepBackward, onReset]);
}
