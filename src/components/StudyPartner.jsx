import React, { useState, useEffect } from 'react';
import studyPartnerGif from '../assets/studypartner.gif';
import { CoffeeIcon } from './DoodleIcons';

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

export default function StudyPartner() {
  const [greeting, setGreeting] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    // Show initial greeting after a short delay
    const initialTimer = setTimeout(() => {
      showRandomGreeting();
    }, 2000);

    // Occasionally show a new greeting
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 15s
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
    
    // Hide after 4 seconds
    setTimeout(() => setShowGreeting(false), 4000);
  };

  return (
    <div className="study-partner-container">
      <div className={`partner-greeting ${showGreeting ? 'visible' : ''}`}>
        {greeting}
      </div>
      <img 
        src={studyPartnerGif} 
        alt="Study Partner" 
        className="study-partner-gif"
        onClick={showRandomGreeting}
        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
      />
      <div className="coffee-cup" onClick={showRandomGreeting} title="Click me for a greeting!">
        <CoffeeIcon size={28} />
      </div>
    </div>
  );
}
