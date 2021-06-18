import React from "react";
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
  const topY = ((padding?.top || 0) - 10).toString();
  const bottomY = (height - (padding?.bottom || 0) + 20).toString();

  const offsetX = (width + 25) / 2;
  const offsetY = (height + 50) / 2;

  return (
    <svg>
      <ChartAxis
        dependentAxis
        crossAxis
        height={height}
        width={width}
        theme={VictoryTheme.grayscale}
        offsetX={offsetX + 5}
        standalone={false}
        padding={padding}
        tickLabelComponent={<></>}
      />
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
      <g>
        <g>
          <text x="100" y={topY}>
            Impactful but not advisable to move
          </text>
          <text x={`${width - 250}`} y={topY}>
            Impactful but migratable
          </text>
          <text x="100" y={bottomY}>
            Inadvisable
          </text>
          <text x={`${width - 225}`} y={bottomY}>
            Trivial but migratable
          </text>
        </g>
      </g>
    </svg>
  );
};
