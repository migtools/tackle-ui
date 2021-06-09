import React, { useCallback, useContext, useEffect, useMemo } from "react";
import Measure from "react-measure";

import { Bullseye, Skeleton } from "@patternfly/react-core";
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartThemeColor,
  ChartVoronoiContainer,
} from "@patternfly/react-charts";

import { useFetch } from "shared/hooks";
import { ConditionalRender, StateError } from "shared/components";

import { ApplicationAdoptionPlan } from "api/models";
import { getApplicationAdoptionPlan } from "api/rest";

import { ApplicationSelectionContext } from "../../application-selection-context";
import { NoApplicationSelectedEmptyState } from "../no-application-selected-empty-state";

interface IChartData {
  applicationId: number;
  applicationName: string;
  startAt: number;
  width: number;
}

export const AdoptionPlan: React.FC = () => {
  // Context
  const { selectedItems: applications } = useContext(
    ApplicationSelectionContext
  );

  // Data
  const fetchChartData = useCallback(() => {
    if (applications.length > 0) {
      return getApplicationAdoptionPlan(applications.map((f) => f.id!)).then(
        ({ data }) => data
      );
    } else {
      return Promise.resolve([]);
    }
  }, [applications]);

  const {
    data: adoptionPlan,
    isFetching,
    fetchError,
    requestFetch: refreshChart,
  } = useFetch<ApplicationAdoptionPlan[]>({
    defaultIsFetching: true,
    onFetchPromise: fetchChartData,
  });

  useEffect(() => {
    refreshChart();
  }, [applications, refreshChart]);

  // Process data
  const chartData: IChartData[] = useMemo(() => {
    return [...(adoptionPlan || [])]
      .sort((a, b) => b.positionY - a.positionY)
      .map((elem) => {
        return {
          applicationId: elem.applicationId,
          applicationName: elem.applicationName,
          startAt: elem.positionX,
          width: elem.effort,
        } as IChartData;
      });
  }, [adoptionPlan]);

  if (fetchError) {
    return <StateError />;
  }

  if (!isFetching && chartData.length === 0) {
    return <NoApplicationSelectedEmptyState />;
  }

  return (
    <ConditionalRender
      when={isFetching}
      then={
        <Bullseye>
          <div style={{ height: 200, width: 400 }}>
            <Skeleton height="75%" width="100%" />
          </div>
        </Bullseye>
      }
    >
      <Measure bounds>
        {({ measureRef, contentRect }) => {
          const chartHeight = chartData.length * 40 + 150;
          const chartWidth = contentRect.bounds?.width || 400;

          return (
            <div ref={measureRef} style={{ maxHeight: 700, overflowY: "auto" }}>
              <div
                style={{
                  height: chartHeight,
                  width: chartWidth,
                }}
              >
                <Chart
                  themeColor={ChartThemeColor.multiOrdered}
                  containerComponent={
                    <ChartVoronoiContainer
                      labels={({ datum }) => `Effort: ${datum.effort}`}
                      constrainToVisibleArea
                    />
                  }
                  domainPadding={{ x: [30, 25] }}
                  height={chartHeight}
                  width={chartWidth}
                  padding={{
                    bottom: 50,
                    left: 250,
                    right: 50,
                    top: 50,
                  }}
                >
                  <ChartAxis />
                  <ChartAxis dependentAxis showGrid />
                  <ChartGroup horizontal={true}>
                    {chartData.map((f) => (
                      <ChartBar
                        key={f.applicationId}
                        barWidth={15}
                        data={[
                          {
                            name: f.applicationName,
                            effort: f.width,
                            x: f.applicationName,
                            y0: f.startAt,
                            y: f.startAt + f.width,
                          },
                        ]}
                      />
                    ))}
                  </ChartGroup>
                </Chart>
              </div>
            </div>
          );
        }}
      </Measure>
    </ConditionalRender>
  );
};
