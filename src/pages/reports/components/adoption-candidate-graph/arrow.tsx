/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from "react";
import { Curve } from "victory-line";
import { global_palette_black_800 as black } from "@patternfly/react-tokens";

export const Arrow: React.FC = (props) => {
  return (
    <g>
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L6,3 z" fill={black.value} />
        </marker>
      </defs>
      <Curve {...props} pathComponent={<path markerEnd="url(#arrow)" />} />
    </g>
  );
};
