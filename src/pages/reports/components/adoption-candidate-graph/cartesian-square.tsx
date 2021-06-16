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
  const topPosition = ((padding?.top || 0) + 20).toString();
  const bottomPosition = (height - (padding?.bottom || 0) - 10).toString();
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
        offsetX={offsetX}
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
          <text x="100" y={topPosition}>
            Impactful but not advisable to move
          </text>
          <text x={`${width - 250}`} y={topPosition}>
            Inpactful but migratable
          </text>
          <text x="100" y={bottomPosition}>
            Inadvisable
          </text>
          <text x={`${width - 225}`} y={bottomPosition}>
            Trivial but migratable
          </text>
        </g>
      </g>
    </svg>
  );
};
