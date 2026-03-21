import React, { useState, useEffect } from 'react';
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
    <div className="study-partner-container horizontal">
      <div className={`partner-greeting ${showGreeting ? 'visible' : ''}`}>
        {greeting}
      </div>
      <div className="coffee-mug-wrapper" onClick={showRandomGreeting} title="Cozy brew!">
        <CoffeeMugIcon size={48} />
      </div>
      <img 
        src={studyPartnerGif} 
        alt="Study Partner" 
        className="study-partner-gif"
        onClick={showRandomGreeting}
        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
      />
    </div>
  );
}
