import React from 'react';
import studyPartnerGif from '../assets/studypartner.gif';

export default function StudyPartner() {
  return (
    <div className="study-partner-container">
      <img 
        src={studyPartnerGif} 
        alt="Study Partner" 
        className="study-partner-gif"
      />
    </div>
  );
}
