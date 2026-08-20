import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Eraser } from 'lucide-react';

export interface SignaturePadHandle {
  /** Clears the canvas and resets the captured signature. */
  clear: () => void;
}

interface SignaturePadProps {
  /** Called with a PNG data URL while drawn, or null when the pad is empty. */
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
}

// A lightweight, dependency-free signature pad. Captures pointer (mouse / touch /
// stylus) strokes onto a canvas and reports the result as a PNG data URL.
export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  function SignaturePad({ onChange, disabled = false }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);
    const [hasInk, setHasInk] = useState(false);

    // Size the canvas backing store to its CSS box × devicePixelRatio for crisp
    // lines, then prime the drawing context. Resizing clears the canvas — fine,
    // since it only happens on mount / orientation change, not mid-stroke.
    const setupCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1e453a'; // matches brand primary
    };

    useEffect(() => {
      setupCanvas();
      const handleResize = () => {
        setupCanvas();
        setHasInk(false);
        onChange(null);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
      // onChange is stable from the parent (declared with useCallback there).
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setHasInk(false);
      onChange(null);
    };

    useImperativeHandle(ref, () => ({ clear }));

    const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (disabled) return;
      // Capture keeps strokes tracking even if the pointer leaves the canvas.
      // Guard it: some environments throw for non-active pointer ids, and a
      // capture failure must never stop drawing.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore — drawing still works without capture */
      }
      drawing.current = true;
      lastPoint.current = pointerPos(e);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current || disabled) return;
      const ctx = canvasRef.current?.getContext('2d');
      const from = lastPoint.current;
      const to = pointerPos(e);
      if (!ctx || !from) return;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      lastPoint.current = to;
      if (!hasInk) setHasInk(true);
    };

    const endStroke = () => {
      if (!drawing.current) return;
      drawing.current = false;
      lastPoint.current = null;
      const canvas = canvasRef.current;
      if (canvas && hasInk) {
        onChange(canvas.toDataURL('image/png'));
      }
    };

    return (
      <div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className={`w-full h-44 rounded-lg border border-border bg-input-background touch-none ${
              disabled ? 'opacity-60' : 'cursor-crosshair'
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endStroke}
            onPointerLeave={endStroke}
            onPointerCancel={endStroke}
          />
          {!hasInk && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              Sign here using your mouse, finger or stylus
            </span>
          )}
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={clear}
            disabled={disabled || !hasInk}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <Eraser size={16} aria-hidden="true" />
            Clear signature
          </button>
        </div>
      </div>
    );
  },
);
