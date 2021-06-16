import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Measure from "react-measure";

import {
  Bullseye,
  Checkbox,
  Skeleton,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  ChartScatter,
  ChartThemeColor,
} from "@patternfly/react-charts";

import { useFetch } from "shared/hooks";
import { ConditionalRender, StateError } from "shared/components";

import { EFFORT_ESTIMATE_LIST, PROPOSED_ACTION_LIST } from "Constants";
import { getAssessmentConfidence } from "api/rest";
import { Application, AssessmentConfidence, ProposedAction } from "api/models";

import { ApplicationSelectionContext } from "../../application-selection-context";
import { CartesianSquare } from "./cartesian-square";
import { Arrow } from "./arrow";

interface LegendItem {
  name: string;
  hexColor: string;
}

interface DataPoint {
  x: number;
  y: number;
  size: number;
  application: Application;
}

interface Serie {
  legendItem: LegendItem;
  datapoints: DataPoint[];
}

type ProposedActionChartDataListType = {
  [key in ProposedAction]: Serie;
};

const defaultChartData: ProposedActionChartDataListType = {
  rehost: {
    legendItem: {
      name: PROPOSED_ACTION_LIST["rehost"].label,
      hexColor: PROPOSED_ACTION_LIST["rehost"].hexColor,
    },
    datapoints: [],
  },
  replatform: {
    legendItem: {
      name: PROPOSED_ACTION_LIST["replatform"].label,
      hexColor: PROPOSED_ACTION_LIST["replatform"].hexColor,
    },
    datapoints: [],
  },
  refactor: {
    legendItem: {
      name: PROPOSED_ACTION_LIST["refactor"].label,
      hexColor: PROPOSED_ACTION_LIST["refactor"].hexColor,
    },
    datapoints: [],
  },
  repurchase: {
    legendItem: {
      name: PROPOSED_ACTION_LIST["repurchase"].label,
      hexColor: PROPOSED_ACTION_LIST["repurchase"].hexColor,
    },
    datapoints: [],
  },
  retire: {
    legendItem: {
      name: PROPOSED_ACTION_LIST["retire"].label,
      hexColor: PROPOSED_ACTION_LIST["retire"].hexColor,
    },
    datapoints: [],
  },
  retain: {
    legendItem: {
      name: PROPOSED_ACTION_LIST["retain"].label,
      hexColor: PROPOSED_ACTION_LIST["retain"].hexColor,
    },
    datapoints: [],
  },
};

export const AdoptionCandidateGraph: React.FC = () => {
  // Context
  const { selectedItems: applications } = useContext(
    ApplicationSelectionContext
  );

  // Controls
  const [showLabels, setShowLabels] = useState(true);

  // Confidence
  const fetchChartData = useCallback(() => {
    if (applications.length > 0) {
      return getAssessmentConfidence(applications.map((f) => f.id!)).then(
        ({ data }) => data
      );
    } else {
      return Promise.resolve([]);
    }
  }, [applications]);

  const {
    data: confidences,
    isFetching,
    fetchError,
    requestFetch: refreshChart,
  } = useFetch<AssessmentConfidence[]>({
    defaultIsFetching: true,
    onFetchPromise: fetchChartData,
  });

  useEffect(() => {
    refreshChart();
  }, [applications, refreshChart]);

  // Chart data
  const chartData: ProposedActionChartDataListType = useMemo(() => {
    if (!confidences) {
      return defaultChartData;
    }

    return applications.reduce((prev, current) => {
      const appConfidence = confidences.find(
        (elem) => elem.applicationId === current.id
      );

      if (appConfidence && current.review) {
        const key = current.review.proposedAction;
        const value = prev[current.review.proposedAction];

        // Create new datapoint
        const effortData = EFFORT_ESTIMATE_LIST[current.review.effortEstimate];
        const datapoint: DataPoint = {
          x: appConfidence.confidence,
          y: current.review.businessCriticality,
          size: effortData ? effortData.size : 0,
          application: { ...current },
        };

        // Process result
        const newValue: Serie = {
          ...value,
          datapoints: [...value.datapoints, datapoint],
        };

        const result: ProposedActionChartDataListType = {
          ...prev,
          [key]: newValue,
        };
        return result;
      }

      return prev;
    }, defaultChartData);
  }, [confidences, applications]);

  if (fetchError) {
    return <StateError />;
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
      <Stack>
        <StackItem>
          <Split>
            <SplitItem>
              <Checkbox
                id="show-labels"
                name="show-labels"
                label="Labels"
                isChecked={showLabels}
                onChange={() => setShowLabels((current) => !current)}
              />
            </SplitItem>
          </Split>
        </StackItem>
        <StackItem isFilled>
          <Measure bounds>
            {({ measureRef, contentRect }) => {
              const chartHeight = 600;
              const chartWidth = contentRect.bounds?.width || 400;
              const chartPadding = {
                bottom: 100,
                left: 75,
                right: 50,
                top: 50,
              };

              return (
                <div ref={measureRef}>
                  <div
                    style={{
                      height: chartHeight,
                      width: chartWidth,
                    }}
                  >
                    <Chart
                      themeColor={ChartThemeColor.gray}
                      legendPosition="bottom-left"
                      legendData={Object.keys(chartData).map((key) => {
                        const serie = chartData[key as ProposedAction];
                        const legend = serie.legendItem;
                        return {
                          name: legend.name,
                          symbol: {
                            fill: legend.hexColor,
                          },
                        };
                      })}
                      padding={chartPadding}
                      height={chartHeight}
                      width={chartWidth}
                      domain={{ x: [0, 100], y: [0, 10] }}
                    >
                      <CartesianSquare
                        height={chartHeight}
                        width={chartWidth}
                        padding={chartPadding}
                      />
                      <ChartAxis
                        label="Confidence"
                        showGrid
                        tickValues={[
                          0,
                          10,
                          20,
                          30,
                          40,
                          50,
                          60,
                          70,
                          80,
                          90,
                          100,
                        ]}
                      />
                      <ChartAxis
                        label="Business criticality"
                        showGrid
                        dependentAxis
                        tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                      />
                      <ChartGroup>
                        {Object.keys(chartData).map((key, i) => {
                          const serie = chartData[key as ProposedAction];
                          const legendItem = serie.legendItem;
                          return (
                            <ChartScatter
                              key={"scatter-" + i}
                              name={"scatter-" + i}
                              data={serie.datapoints}
                              labels={({ datum }) =>
                                showLabels ? datum.application?.name : undefined
                              }
                              style={{
                                data: {
                                  fill: legendItem.hexColor,
                                },
                              }}
                            />
                          );
                        })}
                      </ChartGroup>
                      <ChartGroup>
                        {Object.keys(chartData).map((key, i) => {
                          const serie = chartData[key as ProposedAction];
                          return (
                            <ChartLine
                              key={"line-" + 1}
                              name={"line-" + 1}
                              data={serie.datapoints}
                              style={{
                                data: { stroke: "#b2b2b2", strokeWidth: 3 },
                              }}
                              dataComponent={<Arrow />}
                            />
                          );
                        })}
                      </ChartGroup>
                    </Chart>
                  </div>
                </div>
              );
            }}
          </Measure>
        </StackItem>
      </Stack>
    </ConditionalRender>
  );
};
