'use client';

import { Chessboard } from 'react-chessboard';
import { useState, useEffect, useRef } from 'react';

interface ChessBoardComponentProps {
    fen: string;
    onPieceDrop?: (sourceSquare: string, targetSquare: string) => boolean;
    boardOrientation?: 'white' | 'black';
    customSquareStyles?: Record<string, React.CSSProperties>;
    onMouseOverSquare?: (square: string) => void;
    onMouseOutSquare?: (square: string) => void;
}

export default function ChessBoard({
    fen,
    onPieceDrop,
    boardOrientation = 'white',
    customSquareStyles,
    onMouseOverSquare,
    onMouseOutSquare,
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
            style={{ minWidth: '200px' }}
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
        </div>
    );
}
