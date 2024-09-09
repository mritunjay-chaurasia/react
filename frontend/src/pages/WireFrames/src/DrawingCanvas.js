// DrawingCanvas.js
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import './WireframeRenderer.css';

const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [tool, setTool] = useState('pencil');
    const [color, setColor] = useState('#000000');
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 }); // Default size

    useEffect(() => {
        // Adjust this effect to set canvas size based on the actual wireframe content size
        // For dynamic sizing, you might want to observe size changes or trigger this on window resize events

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const startDrawing = (e) => {
            setDrawing(true);
            context.beginPath();
            // Adjust coordinates if canvas is scaled
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            context.moveTo(x, y);
        };

        const draw = (e) => {
            if (!drawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            context.lineTo(x, y);
            context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
            context.lineWidth = tool === 'eraser' ? 10 : 1;
            context.stroke();
        };

        const stopDrawing = () => {
            setDrawing(false);
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
        };
    }, [tool, color, drawing]); // Include `drawing` in the dependencies array

    return (
        <div className="drawing-canvas">
            <select onChange={(e) => setTool(e.target.value)}>
                <option value="pencil">Pencil</option>
                <option value="eraser">Eraser</option>
            </select>
            <input type="color" onChange={(e) => setColor(e.target.value)} />
            <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
        </div>
    );
};

export default DrawingCanvas;