// src/components/SpriteIcon.jsx
import React from "react";

const SpriteIcon = ({ name, size, color = "currentColor" }) => {
  return (
    <svg width={size} height={size} fill={color}>
      <use href={`#icon-${name}`} />
      <use href={`/spriteStyle.svg#icon-${name}`} />
      <use href={`/sprite.svg#icon-${name}`} />
    </svg>
  );
};

export default SpriteIcon;
