import React, { useEffect, useState } from "react";

import { Split, SplitItem } from "@patternfly/react-core";
import { global_palette_blue_300 as defaultColor } from "@patternfly/react-tokens";

import { ConditionalRender, NoDataEmptyState } from "shared/components";

import { DEFAULT_RISK_LABELS } from "Constants";
import { Application } from "api/models";
import { getLandscape } from "api/rest";

import { Donut } from "./donut";

export interface ILandscapeProps {
  applications: Application[];
}

interface LandscapeData {
  low: number;
  medium: number;
  high: number;
  unassesed: number;
}

const defaultLandscape: LandscapeData = {
  low: 0,
  medium: 0,
  high: 0,
  unassesed: 0,
};

export const Landscape: React.FC<ILandscapeProps> = ({ applications }) => {
  const [landscapeData, setLandscapeData] = useState<LandscapeData>(
    defaultLandscape
  );

  useEffect(() => {
    if (applications.length > 0) {
      getLandscape(applications.map((f) => f.id!)).then(({ data }) => {
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

        unassesed = applications.length - low - medium - high;
        setLandscapeData({ low, medium, high, unassesed });
      });
    } else {
      setLandscapeData(defaultLandscape);
    }
  }, [applications]);

  return (
    <ConditionalRender
      when={applications.length === 0}
      then={<NoDataEmptyState title="No applications selected" />}
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
            riskLabel="Unasssed"
            riskDescription="Not assesed yet"
          />
        </SplitItem>
      </Split>
    </ConditionalRender>
  );
};
