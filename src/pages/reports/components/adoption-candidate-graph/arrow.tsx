import React from "react";
import { Curve } from "victory-line";

export const Arrow: React.FC = (props) => {
  return (
    <g>
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="1"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#282828" />
        </marker>
      </defs>
      <Curve {...props} pathComponent={<path markerEnd="url(#arrow)" />} />
    </g>
  );
};
