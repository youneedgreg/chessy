import { useEffect, useCallback } from 'react';

export interface KeyboardActions {
    onNextMove?: () => void;
    onPrevMove?: () => void;
    onFirstMove?: () => void;
    onLastMove?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onToggleExplanation?: () => void;
    onClose?: () => void;
    onShowShortcuts?: () => void;
}

export function useKeyboardShortcuts(actions: KeyboardActions) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Ignore if user is typing in an input or textarea
        if (
            document.activeElement?.tagName === 'INPUT' ||
            document.activeElement?.tagName === 'TEXTAREA' ||
            (document.activeElement as HTMLElement)?.isContentEditable
        ) {
            return;
        }

        const { key, ctrlKey, shiftKey, metaKey } = event;
        const isCmdOrCtrl = ctrlKey || metaKey; // Support Mac Command key

        switch (key) {
            case 'ArrowRight':
                event.preventDefault();
                actions.onNextMove?.();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                actions.onPrevMove?.();
                break;
            case 'ArrowUp':
                event.preventDefault();
                actions.onFirstMove?.();
                break;
            case 'ArrowDown':
                event.preventDefault();
                actions.onLastMove?.();
                break;
            case ' ':
                event.preventDefault();
                actions.onToggleExplanation?.();
                break;
            case 'Escape':
                event.preventDefault();
                actions.onClose?.();
                break;
            case 'z':
            case 'Z':
                if (isCmdOrCtrl) {
                    event.preventDefault();
                    if (shiftKey) {
                        actions.onRedo?.();
                    } else {
                        actions.onUndo?.();
                    }
                }
                break;
            case 'y':
            case 'Y':
                if (isCmdOrCtrl) {
                    event.preventDefault();
                    actions.onRedo?.();
                }
                break;
            case '?':
            case '/':
                if (shiftKey || key === '?') {
                    // event.preventDefault(); // Don't prevent default for /, might conflict
                    if (key === '?' || (key === '/' && shiftKey)) {
                        event.preventDefault();
                        actions.onShowShortcuts?.();
                    }
                }
                break;
        }
    }, [actions]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
