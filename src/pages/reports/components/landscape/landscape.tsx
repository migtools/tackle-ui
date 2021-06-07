import React, { useEffect, useState } from "react";

import { Split, SplitItem } from "@patternfly/react-core";
import { global_palette_blue_300 as defaultColor } from "@patternfly/react-tokens";

import { ConditionalRender, NoDataEmptyState } from "shared/components";

import { DEFAULT_RISK_LABELS } from "Constants";
import { Application, AssessmentRisk } from "api/models";
import { getAssessmentLandscape } from "api/rest";

import { Donut } from "./donut";

interface ILandscapeData {
  low: number;
  medium: number;
  high: number;
  unassesed: number;
}

const defaultLandscape: ILandscapeData = {
  low: 0,
  medium: 0,
  high: 0,
  unassesed: 0,
};

const extractLandscapeData = (
  totalApps: number,
  data: AssessmentRisk[]
): ILandscapeData => {
  let low = 0;
  let medium = 0;
  let high = 0;
  let unassesed = 0;

  data.forEach((elem) => {
    switch (elem.risk) {
      case "GREEN":
        low++;
        break;
      case "AMBER":
        medium++;
        break;
      case "RED":
        high++;
        break;
    }
  });

  unassesed = totalApps - low - medium - high;
  return { low, medium, high, unassesed };
};

export interface ILandscapeProps {
  applications: Application[];
}

export const Landscape: React.FC<ILandscapeProps> = ({ applications }) => {
  const [landscapeData, setLandscapeData] = useState<ILandscapeData>(
    defaultLandscape
  );

  useEffect(() => {
    if (applications.length > 0) {
      getAssessmentLandscape(applications.map((f) => f.id!)).then(({ data }) =>
        setLandscapeData(extractLandscapeData(applications.length, data))
      );
    } else {
      setLandscapeData(defaultLandscape);
    }
  }, [applications]);

  return (
    <ConditionalRender
      when={applications.length === 0}
      then={<NoDataEmptyState title="No data available" />}
    >
      <Split hasGutter>
        <SplitItem>
          <Donut
            value={landscapeData.low}
            total={applications.length}
            color={
              DEFAULT_RISK_LABELS.get("GREEN")?.color || defaultColor.value
            }
            riskLabel="Low risk"
            riskDescription="Cloud-native ready"
          />
        </SplitItem>
        <SplitItem>
          <Donut
            value={landscapeData.medium}
            total={applications.length}
            color={
              DEFAULT_RISK_LABELS.get("AMBER")?.color || defaultColor.value
            }
            riskLabel="Medium risk"
            riskDescription="Modernizable"
          />
        </SplitItem>
        <SplitItem>
          <Donut
            value={landscapeData.high}
            total={applications.length}
            color={DEFAULT_RISK_LABELS.get("RED")?.color || defaultColor.value}
            riskLabel="High risk"
            riskDescription="Unsuitable for containers"
          />
        </SplitItem>
        <SplitItem>
          <Donut
            value={landscapeData.unassesed}
            total={applications.length}
            color={
              DEFAULT_RISK_LABELS.get("UNKNOWN")?.color || defaultColor.value
            }
            riskLabel="Unassessed"
            riskDescription="Not yet assessed"
          />
        </SplitItem>
      </Split>
    </ConditionalRender>
  );
};
