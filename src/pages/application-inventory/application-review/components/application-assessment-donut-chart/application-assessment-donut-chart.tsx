import React, { useMemo } from "react";
import { ChartDonut } from "@patternfly/react-charts";

import { global_palette_black_400 as black } from "@patternfly/react-tokens";

import { Assessment } from "api/models";

interface ChartData {
  red: number;
  amber: number;
  green: number;
  unknown: number;
}

export interface IApplicationAssessmentDonutChartProps {
  assessment: Assessment;
}

export const ApplicationAssessmentDonutChart: React.FC<IApplicationAssessmentDonutChartProps> = ({
  assessment,
}) => {
  const charData: ChartData = useMemo(() => {
    let green = 0;
    let amber = 0;
    let red = 0;
    let unknown = 0;

    assessment.questionnaire.categories
      .flatMap((f) => f.questions)
      .flatMap((f) => f.options)
      .filter((f) => f.checked === true)
      .forEach((f) => {
        if (f.risk === "GREEN") {
          green++;
        } else if (f.risk === "AMBER") {
          amber++;
        } else if (f.risk === "RED") {
          red++;
        } else {
          unknown++;
        }
      });

    return {
      red,
      amber,
      green,
      unknown,
    };
  }, [assessment]);

  return (
    <div style={{ height: "230px", width: "230px" }}>
      <ChartDonut
        ariaDesc="Number of question with risk"
        ariaTitle="Risk"
        constrainToVisibleArea={true}
        data={[
          { x: "Green", y: charData.green },
          { x: "Amber", y: charData.amber },
          { x: "Red", y: charData.red },
          { x: "Unknown", y: charData.unknown },
        ]}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        colorScale={["#68b240", "#f0ab0b", "#cb440d", black.value]}
        innerRadius={50}
      />
    </div>
  );
};
