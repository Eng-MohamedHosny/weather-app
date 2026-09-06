import React from 'react';

export default function NoiseOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none rounded-[20px] md:rounded-[24px] overflow-hidden z-0 opacity-45 mix-blend-screen"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <filter id="figma-noise-filter" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9 0.9"
          numOctaves="3"
          stitchTiles="stitch"
          seed="6859"
          result="noise"
        />
        <feColorMatrix type="luminanceToAlpha" in="noise" result="alphaNoise" />
        <feComponentTransfer in="alphaNoise" result="coloredNoise">
          <feFuncA
            type="discrete"
            tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
          />
        </feComponentTransfer>
        <feFlood floodColor="rgba(255, 255, 255, 0.5)" result="colorFlood" />
        <feComposite in="colorFlood" in2="coloredNoise" operator="in" result="noiseColored" />
        <feComposite in="noiseColored" in2="SourceGraphic" operator="in" />
      </filter>
      <rect width="100%" height="100%" filter="url(#figma-noise-filter)" fill="#ffffff" />
    </svg>
  );
}
