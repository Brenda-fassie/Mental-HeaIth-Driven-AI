"use client";

import React from "react";
import "./hero-animation.css";

export const HeroAnimation = () => {
  return (
    <div className="hero-animation-container">
      <div className="stars">
        <svg xmlns="http://www.w3.org/2000/svg" className="one">
          <filter id="starf1">
            <feTurbulence baseFrequency="0.1" seed="50" id="starturb1" />
            <feColorMatrix
              values="0 0 0 9 -5 
                      0 0 0 9 -5
                      0 0 0 9 -5
                      0 0 0 0 .5"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#starf1)" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="two">
          <filter id="starf2">
            <feTurbulence baseFrequency="0.1" seed="10" id="starturb2" />
            <feColorMatrix
              values="0 0 0 9 -5 
                      0 0 0 9 -5
                      0 0 0 9 -5
                      0 0 0 0 .5"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#starf2)" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="three">
          <filter id="starf3">
            <feTurbulence baseFrequency="0.1" seed="10" id="starturb3" />
            <feColorMatrix
              values="0 0 0 9 -5 
                      0 0 0 9 -5
                      0 0 0 9 -5
                      0 0 0 0 .5"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#starf3)" />
        </svg>
      </div>
      <div className="pic">
        <div className="cat">
          <div className="head">
            <div className="ear lt" />
            <div className="ear rt" />
            <div className="eye lt" />
            <div className="eye rt" />
          </div>
          <div className="body">
            <div className="tail" />
            <div className="leg bk" />
            <div className="leg fw" />
          </div>
        </div>
      </div>
      <div className="roof" />
    </div>
  );
};
