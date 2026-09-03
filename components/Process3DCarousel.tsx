'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, MoveHorizontal } from 'lucide-react';

export interface ProcessStep {
  number: string;
  title: string;
  tag: string;
  text: string;
  metric: string;
  accent: string;
}

const defaultProcessSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Concept & Architecture',
    tag: 'Core Vision',
    text: 'Define the idea, target player, core mechanic, art direction, and store positioning.',
    metric: 'phase: 01_concept',
    accent: '#12d6c5',
  },
  {
    number: '02',
    title: 'Prototype & Physics',
    tag: 'Playable Loop',
    text: 'Build the playable loop and test if the game feels clear, responsive, and repeatable.',
    metric: 'physics: 60fps_ready',
    accent: '#ff6b1a',
  },
  {
    number: '03',
    title: 'Production & Systems',
    tag: '3D Gameplay',
    text: 'Create missions, vehicles, systems, UI, levels, monetization hooks, and progression.',
    metric: 'build: mobile_engine',
    accent: '#38bdf8',
  },
  {
    number: '04',
    title: 'Polish & Audiovisual',
    tag: 'Feel & Feedback',
    text: 'Improve feedback, effects, menus, balancing, audio cues, and the overall mobile feel.',
    metric: 'shaders: optimized',
    accent: '#a855f7',
  },
  {
    number: '05',
    title: 'Testing & Optimization',
    tag: 'QA & Profiling',
    text: 'Check Android performance, screen sizes, stability, ads flow, and release readiness.',
    metric: 'memory: stable_pass',
    accent: '#22c55e',
  },
  {
    number: '06',
    title: 'Google Play Launch',
    tag: 'Store Release',
    text: 'Prepare app builds, store assets, descriptions, screenshots, and Google Play publishing support.',
    metric: 'store: production_live',
    accent: '#f59e0b',
  },
];

export default function Process3DCarousel({
  steps = defaultProcessSteps,
}: {
  steps?: ProcessStep[];
}) {
  const count = steps.length;
  const angleStep = 360 / count;

  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(340);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const currentRotationRef = useRef(0);
  const isPointerDownRef = useRef(false);

  // Responsive 3D radius
  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setRadius(220);
      } else if (width < 768) {
        setRadius(270);
      } else if (width < 1024) {
        setRadius(340);
      } else {
        setRadius(400);
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Track active index from rotation angle
  useEffect(() => {
    const normalized = ((-rotation % 360) + 360) % 360;
    const index = Math.round(normalized / angleStep) % count;
    setActiveIndex(index);
    currentRotationRef.current = rotation;
  }, [rotation, angleStep, count]);

  // Snap to closest card on release
  const snapToClosest = useCallback(() => {
    const current = currentRotationRef.current;
    const targetAngle = Math.round(current / angleStep) * angleStep;
    setRotation(targetAngle);
  }, [angleStep]);

  const rotateTo = (index: number) => {
    const targetAngle = -index * angleStep;
    setRotation(targetAngle);
  };

  const handlePrev = () => {
    setRotation((prev) => Math.round(prev / angleStep) * angleStep + angleStep);
  };

  const handleNext = () => {
    setRotation((prev) => Math.round(prev / angleStep) * angleStep - angleStep);
  };

  // Touch & Mouse Drag handlers
  const handlePointerDown = (clientX: number) => {
    isPointerDownRef.current = true;
    startXRef.current = clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isPointerDownRef.current) return;
    const deltaX = clientX - startXRef.current;
    startXRef.current = clientX;

    const sensitivity = window.innerWidth < 768 ? 0.45 : 0.35;
    setRotation((prev) => prev + deltaX * sensitivity);
  };

  const handlePointerUp = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);
    snapToClosest();
  };

  return (
    <div className="process-3d-wrapper">
      {/* Gesture Hint Badge */}
      <div className="carousel-gesture-hint">
        <MoveHorizontal size={15} />
        <span>Swipe with finger or drag with mouse to spin</span>
      </div>

      {/* 3D Scene Viewport */}
      <div
        ref={containerRef}
        className="process-3d-viewport"
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches[0]) handlePointerDown(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
        }}
        onTouchEnd={handlePointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="process-3d-ring"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {steps.map((step, index) => {
            const cardAngle = index * angleStep;
            const isCurrent = activeIndex === index;

            return (
              <div
                key={step.number}
                className={`process-3d-card ${isCurrent ? 'is-active' : ''}`}
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  borderColor: isCurrent ? step.accent : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: isCurrent
                    ? `0 18px 48px -10px ${step.accent}33, 0 0 24px -2px ${step.accent}44`
                    : 'none',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  rotateTo(index);
                }}
              >
                <div className="card-ambient-glow" style={{ background: step.accent }} />

                <div className="card-topline">
                  <span className="step-pill" style={{ color: step.accent, borderColor: `${step.accent}44` }}>
                    <Sparkles size={12} />
                    {step.tag}
                  </span>
                  <span className="step-number" style={{ color: step.accent }}>
                    {step.number}
                  </span>
                </div>

                <h3 className="card-title">{step.title}</h3>
                <p className="card-desc">{step.text}</p>

                <div className="card-console-footer">
                  <span className="console-prompt">&gt;</span>
                  <span className="console-text">{step.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-nav-btn"
          onClick={handlePrev}
          aria-label="Previous step"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="carousel-dots">
          {steps.map((step, i) => (
            <button
              key={step.number}
              type="button"
              className={`carousel-dot ${activeIndex === i ? 'is-active' : ''}`}
              onClick={() => rotateTo(i)}
              aria-label={`Go to step ${step.number}`}
              style={{
                backgroundColor: activeIndex === i ? steps[i].accent : undefined,
                boxShadow: activeIndex === i ? `0 0 12px ${steps[i].accent}` : undefined,
              }}
            >
              <span>{step.number}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="carousel-nav-btn"
          onClick={handleNext}
          aria-label="Next step"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
