import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import studyPartnerGif from '../assets/studypartner.gif';
import { CoffeeMugIcon } from './DoodleIcons';

const GREETINGS = [
  "Hello! Ready to study?",
  "You're doing great!",
  "Let's focus together 📚",
  "Stay hydrated! 💧",
  "Time for some deep work ✨",
  "Take a break if you need to!",
  "Making progress every day!",
  "Focus mode: ON 🚀",
  "Coffee & Focus ☕️",
  "Happy studying!"
];

// Reusable draggable wrapper
const DraggableItem = ({ children, defaultOffsetX, defaultOffsetY, onInteract }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ startX: 0, startY: 0, initX: 0, initY: 0, moved: false });
  const initialized = useRef(false);

  // Set initial position based on window size
  useLayoutEffect(() => {
    if (!initialized.current) {
      setPos({
        x: window.innerWidth + defaultOffsetX,
        y: window.innerHeight / 2 + defaultOffsetY
      });
      initialized.current = true;
    }
  }, [defaultOffsetX, defaultOffsetY]);

  const handlePointerDown = (e) => {
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    
    dragInfo.current = {
      startX: clientX,
      startY: clientY,
      initX: pos.x,
      initY: pos.y,
      moved: false
    };
    setIsDragging(true);
    e.target.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    
    // Calculate distance moved
    const dx = clientX - dragInfo.current.startX;
    const dy = clientY - dragInfo.current.startY;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragInfo.current.moved = true;
    }
    
    setPos({
      x: dragInfo.current.initX + dx,
      y: dragInfo.current.initY + dy
    });
    
    // Prevent default scrolling on mobile when dragging
    if (e.cancelable) e.preventDefault();
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture?.(e.pointerId);
    
    // If we didn't drag it significantly, treat it as a click
    if (!dragInfo.current.moved && onInteract) {
      onInteract();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 2000 : 1000,
        touchAction: 'none' // Important for mobile dragging
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div style={{ pointerEvents: 'none' }}>
        {children}
      </div>
    </div>
  );
};

export default function StudyPartner() {
  const [greeting, setGreeting] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      showRandomGreeting();
    }, 2000);

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        showRandomGreeting();
      }
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const showRandomGreeting = () => {
    const randomIdx = Math.floor(Math.random() * GREETINGS.length);
    setGreeting(GREETINGS[randomIdx]);
    setShowGreeting(true);
    setTimeout(() => setShowGreeting(false), 4000);
  };

  return (
    <>
      <DraggableItem defaultOffsetX={-310} defaultOffsetY={30} onInteract={showRandomGreeting}>
        <div className="coffee-mug-wrapper" title="Drag me!">
          <CoffeeMugIcon size={48} />
        </div>
      </DraggableItem>

      <DraggableItem defaultOffsetX={-240} defaultOffsetY={-100} onInteract={showRandomGreeting}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div 
            className={`partner-greeting ${showGreeting ? 'visible' : ''}`}
            style={{ 
              position: 'absolute', 
              top: '-50px', 
              left: '50%',
              transform: showGreeting ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
              opacity: showGreeting ? 1 : 0,
              pointerEvents: 'none'
            }}
          >
            {greeting}
          </div>
          <img 
            src={studyPartnerGif} 
            alt="Study Partner" 
            className="study-partner-gif"
            style={{ animation: 'partnerFloat 6s ease-in-out infinite' }}
            title="Drag me!"
          />
        </div>
      </DraggableItem>
    </>
  );
}
