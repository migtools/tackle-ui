import React, { useCallback, useContext, useEffect, useMemo } from "react";

import { Skeleton, Split, SplitItem } from "@patternfly/react-core";
import { global_palette_blue_300 as defaultColor } from "@patternfly/react-tokens";

import { ConditionalRender, StateError } from "shared/components";
import { useFetch } from "shared/hooks";

import { DEFAULT_RISK_LABELS } from "Constants";
import { AssessmentRisk } from "api/models";
import { getAssessmentLandscape } from "api/rest";

import { ApplicationSelectionContext } from "../../application-selection-context";
import { Donut } from "./donut";
import { NoApplicationSelectedEmptyState } from "../no-application-selected-empty-state";

interface ILandscapeData {
  low: number;
  medium: number;
  high: number;
  unassesed: number;
}

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

export interface ILandscapeProps {}

export const Landscape: React.FC<ILandscapeProps> = () => {
  // Context
  const { allItems: applications } = useContext(ApplicationSelectionContext);

  // Data
  const fetchLandscapeData = useCallback(() => {
    if (applications.length > 0) {
      return getAssessmentLandscape(applications.map((f) => f.id!)).then(
        ({ data }) => data
      );
    } else {
      return Promise.resolve([]);
    }
  }, [applications]);

  const {
    data: assessmentRisks,
    isFetching,
    fetchError,
    requestFetch: refreshChart,
  } = useFetch<AssessmentRisk[]>({
    defaultIsFetching: true,
    onFetchPromise: fetchLandscapeData,
  });

  useEffect(() => {
    refreshChart();
  }, [applications, refreshChart]);

  const landscapeData = useMemo(() => {
    if (applications.length > 0 && assessmentRisks) {
      return extractLandscapeData(applications.length, assessmentRisks);
    } else {
      return undefined;
    }
  }, [applications, assessmentRisks]);

  if (fetchError) {
    return <StateError />;
  }

  if (!isFetching && !landscapeData) {
    return <NoApplicationSelectedEmptyState />;
  }

  return (
    <ConditionalRender
      when={isFetching}
      then={
        <div style={{ height: 200, width: 400 }}>
          <Skeleton height="75%" width="100%" />
        </div>
      }
    >
      {landscapeData && (
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
              color={
                DEFAULT_RISK_LABELS.get("RED")?.color || defaultColor.value
              }
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
      )}
    </ConditionalRender>
  );
};
