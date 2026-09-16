import React, { useRef } from "react";

/**
 * Subtle 3D tilt-on-hover wrapper for a book cover.
 * Uses pointer-move to rotate the child card slightly.
 */
export default function TiltCover({ children, className = "", max = 10 }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(0)`;
  };
  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(900px) rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
      className={className}
    >
      {children}
    </div>
  );
}
