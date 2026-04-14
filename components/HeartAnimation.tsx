import React from "react";
import "./heart-animation.css";

const N = 8;
const W = 400;
const H = 300;

export const HeartAnimation = () => {
  const elements = [];
  
  // We generate the random values directly during server rendering.
  // Since this is a Server Component, these values are baked into the 
  // HTML sent to the client, so there is no hydration mismatch.
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x = i * 1.25 * W;
      const y = j * 1.25 * H;
      const translate = `translate(${x}, ${y})`;
      
      const angle = Math.floor(Math.random() * 50 - 30);
      const rotate = `rotate(${angle})`;
      
      const f = Math.pow(-1, i + j) * Math.random() * 0.25 + 1;
      const scale = `scale(${f} ${f})`;
      
      const skewXVal = Math.floor(Math.random() * 50 - 30);
      const skewX = `skewX(${skewXVal})`;
      
      const transform = `${translate} ${rotate} ${scale} ${skewX}`;
      
      const duration = (5 + 0.1 * Math.floor(Math.random() * 100)).toFixed(2);
      const delay = (-0.01 * Math.floor(Math.random() * 100) * parseFloat(duration)).toFixed(2);
      
      const h = Math.floor(Math.random() * 25 + 330);
      const s = Math.floor(Math.random() * 26 + 70);
      const l = Math.floor(Math.random() * 26 + 47);
      const stroke = `hsl(${h}, ${s}%, ${l}%)`;

      elements.push({
        id: `${i}-${j}`,
        transform,
        stroke,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      });
    }
  }

  return (
    <div className="heart-animation-container opacity-20 dark:opacity-30">
      <svg
        viewBox={`${-0.5 * W} ${-0.5 * H} ${10 * W} ${10 * H}`}
        preserveAspectRatio="xMidYMid slice"
        className="heart-svg"
      >
        <defs>
          <clipPath id="c-heart">
            <path id="heart-path" d="M-50 156c369-94 309-406 72-203c42-218-391-53-89 195" />
          </clipPath>
          <mask id="m-heart" maskUnits="userSpaceOnUse">
            <rect x="-200" y="-150" width="410" height="310" fill="#fff" />
            <path d="M-50 156c349-101 289-386 62-183c42-205-346-83-79 175" />
          </mask>
        </defs>

        {elements.map((el) => (
          <use
            key={el.id}
            xlinkHref="#heart-path"
            className="heart-use"
            transform={el.transform}
            style={{
              stroke: el.stroke,
              animationDuration: el.animationDuration,
              animationDelay: el.animationDelay,
            }}
          />
        ))}
      </svg>
    </div>
  );
};
