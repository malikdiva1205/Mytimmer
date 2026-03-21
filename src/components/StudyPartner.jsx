import React from 'react';
import studyPartnerGif from '../assets/studypartner.gif';
import { CoffeeIcon } from './DoodleIcons';

export default function StudyPartner() {
  return (
    <div className="study-partner-container">
      <img 
        src={studyPartnerGif} 
        alt="Study Partner" 
        className="study-partner-gif"
      />
      <div className="coffee-cup" title="Fresh brew for productive vibes">
        <CoffeeIcon size={24} color="var(--peach)" />
      </div>
    </div>
  );
}
