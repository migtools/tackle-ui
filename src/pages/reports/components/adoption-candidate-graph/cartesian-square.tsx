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
import { useTranslation } from "react-i18next";
import { ChartAxis } from "@patternfly/react-charts";
import { VictoryTheme, BlockProps } from "victory-core";

interface ICartesianSquareProps {
  height: number;
  width: number;
  padding?: BlockProps;
}

export const CartesianSquare: React.FC<ICartesianSquareProps> = ({
  height,
  width,
  padding,
}) => {
  const { t } = useTranslation();

  // Quadrants
  const topY = ((padding?.top || 0) - 10).toString();
  const bottomY = (height - (padding?.bottom || 0) + 20).toString();
  const leftX = (padding?.left || 0).toString();
  const rightX = width - (padding?.right || 0);

  // Axis
  const offsetX = (width + ((padding?.left || 0) - (padding?.right || 0))) / 2;
  const offsetY = (height + ((padding?.bottom || 0) - (padding?.top || 0))) / 2;

  return (
    <svg>
      <g>
        <g>
          <text x={leftX} y={topY}>
            {t("terms.impactfulButNotAdvisableToMove")}
          </text>
          <text x={`${rightX - 180}`} y={topY}>
            {t("terms.impactfulButMigratable")}
          </text>
          <text x={leftX} y={bottomY}>
            {t("terms.inadvisable")}
          </text>
          <text x={`${rightX - 150}`} y={bottomY}>
            {t("terms.trivialButMigratable")}
          </text>
        </g>
      </g>
      <ChartAxis
        crossAxis
        height={height}
        width={width}
        theme={VictoryTheme.grayscale}
        offsetY={offsetY}
        standalone={false}
        padding={padding}
        tickLabelComponent={<></>}
      />
      <ChartAxis
        dependentAxis
        crossAxis
        height={height}
        width={width}
        theme={VictoryTheme.grayscale}
        offsetX={offsetX}
        standalone={false}
        padding={padding}
        tickLabelComponent={<></>}
      />
    </svg>
  );
};
