import React from 'react';

interface ShortcutsModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ShortcutsModal({ open, onClose }: ShortcutsModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}>
            <div className="bg-neutral-800 rounded-xl border border-white/10 p-6 max-w-md w-full shadow-2xl"
                onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Keyboard Shortcuts
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
                        <ShortcutRow label="Next Move" keys={['→']} />
                        <ShortcutRow label="Previous Move" keys={['←']} />
                        <ShortcutRow label="Game Start" keys={['↑']} />
                        <ShortcutRow label="Game End" keys={['↓']} />
                        <ShortcutRow label="Undo Move" keys={['Ctrl', 'Z']} />
                        <ShortcutRow label="Redo Move" keys={['Ctrl', 'Y']} />
                        <ShortcutRow label="Explanation" keys={['Space']} />
                        <ShortcutRow label="Close" keys={['Esc']} />
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-500">
                    Press <span className="bg-white/10 px-1 rounded">?</span> to show this menu anytime
                </div>
            </div>
        </div>
    );
}

const ShortcutRow = ({ label, keys }: { label: string, keys: string[] }) => (
    <div className="flex justify-between items-center group">
        <span className="text-gray-400 group-hover:text-gray-200 transition-colors">{label}</span>
        <div className="flex gap-1">
            {keys.map((k, i) => (
                <kbd key={i} className="min-w-[24px] text-center px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-xs font-mono text-gray-300 shadow-sm">
                    {k}
                </kbd>
            ))}
        </div>
    </div>
);
