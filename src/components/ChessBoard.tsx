'use client';

import { Chessboard } from 'react-chessboard';
import { useState, useEffect, useRef } from 'react';

import { Arrow } from '@/logic/arrows';

interface ChessBoardComponentProps {
    fen: string;
    onPieceDrop?: (sourceSquare: string, targetSquare: string) => boolean;
    boardOrientation?: 'white' | 'black';
    customSquareStyles?: Record<string, React.CSSProperties>;
    onMouseOverSquare?: (square: string) => void;
    onMouseOutSquare?: (square: string) => void;
    arrows?: Arrow[];
}

export default function ChessBoard({
    fen,
    onPieceDrop,
    boardOrientation = 'white',
    customSquareStyles,
    onMouseOverSquare,
    onMouseOutSquare,
    arrows = [],
}: ChessBoardComponentProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [boardSize, setBoardSize] = useState(300);

    useEffect(() => {
        if (!wrapperRef.current) return;

        const updateSize = () => {
            if (wrapperRef.current) {
                const width = wrapperRef.current.offsetWidth;
                setBoardSize(width);
            }
        };

        updateSize();

        const resizeObserver = new ResizeObserver(() => {
            updateSize();
        });

        resizeObserver.observe(wrapperRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Wrap the onPieceDrop to match the library's expected signature
    const handlePieceDrop = ({ piece, sourceSquare, targetSquare }: { piece: any; sourceSquare: string; targetSquare: string | null }) => {
        if (!targetSquare || !onPieceDrop) return false;
        return onPieceDrop(sourceSquare, targetSquare);
    };

    // Custom styles for a premium, minimalist look
    const darkSquareStyle = { backgroundColor: '#779952' };
    const lightSquareStyle = { backgroundColor: '#edeed1' };

    return (
        <div
            ref={wrapperRef}
            className="w-full max-w-[min(80vh,100%)] aspect-square mx-auto shadow-2xl rounded-sm overflow-hidden"
            style={{ minWidth: '200px', position: 'relative' }}
        >
            <Chessboard
                options={{
                    position: fen,
                    boardOrientation: boardOrientation,
                    darkSquareStyle: darkSquareStyle,
                    lightSquareStyle: lightSquareStyle,
                    animationDurationInMs: 200,
                    onPieceDrop: handlePieceDrop,
                    squareStyles: customSquareStyles,
                    onMouseOverSquare: onMouseOverSquare ? ({ square }) => onMouseOverSquare(square) : undefined,
                    onMouseOutSquare: onMouseOutSquare ? ({ square }) => onMouseOutSquare(square) : undefined,
                }}
            />
            {/* Render arrows as SVG overlays */}
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 8 8"
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            >
                {arrows.map((arrow, idx) => {
                    // Convert square to board coordinates (0-7)
                    const squareToCoords = (sq: string) => {
                        const file = sq.charCodeAt(0) - 97;
                        const rank = 8 - parseInt(sq[1]);
                        return [file + 0.5, rank + 0.5];
                    };
                    const [x1, y1] = squareToCoords(arrow.from);
                    const [x2, y2] = squareToCoords(arrow.to);
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const ux = dx / len;
                    const uy = dy / len;
                    // Arrowhead
                    const arrowHeadSize = 0.25;
                    const ax = x2 - ux * 0.3;
                    const ay = y2 - uy * 0.3;
                    return (
                        <g key={idx}>
                            <line
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={arrow.color}
                                strokeWidth={0.18}
                                strokeDasharray={arrow.style === 'dashed' ? '0.2 0.2' : undefined}
                                opacity={0.85}
                                markerEnd={`url(#arrowhead-${idx})`}
                            />
                            <marker
                                id={`arrowhead-${idx}`}
                                markerWidth={0.6}
                                markerHeight={0.6}
                                refX={0.3}
                                refY={0.3}
                                orient="auto"
                                markerUnits="strokeWidth"
                            >
                                <polygon points="0,0 0.6,0.3 0,0.6 0.15,0.3" fill={arrow.color} />
                            </marker>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
