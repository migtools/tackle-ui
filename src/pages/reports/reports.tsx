import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  Bullseye,
  Card,
  CardBody,
  CardHeader,
  Level,
  LevelItem,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Text,
  TextContent,
  Toolbar,
  ToolbarChip,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import { ChartDonut } from "@patternfly/react-charts";

import { useApplicationToolbarFilter, useFetch } from "shared/hooks";
import { ApplicationToolbarToggleGroup } from "shared/components";

import { ApplicationFilterKey } from "Constants";

import { getApplications, getLandscape } from "api/rest";
import { Application, ApplicationPage } from "api/models";
import { applicationPageMapper, fetchAllPages } from "api/apiUtils";

export const Reports: React.FC = () => {
  // i18
  const { t } = useTranslation();

  // Toolbar filters
  const {
    filters: filtersValue,
    // isPresent: areFiltersPresent,
    addFilter,
    setFilter,
    clearAllFilters,
  } = useApplicationToolbarFilter();

  // Table data
  // const {
  //   paginationQuery,
  //   handlePaginationChange,
  // } = useTableControls();

  const fetchApplications = useCallback(() => {
    const nameVal = filtersValue.get(ApplicationFilterKey.NAME);
    const descriptionVal = filtersValue.get(ApplicationFilterKey.DESCRIPTION);
    const serviceVal = filtersValue.get(ApplicationFilterKey.BUSINESS_SERVICE);
    const tagVal = filtersValue.get(ApplicationFilterKey.TAG);

    const getApplicationPage = (page: number) => {
      return getApplications(
        {
          name: nameVal?.map((f) => f.key),
          description: descriptionVal?.map((f) => f.key),
          businessService: serviceVal?.map((f) => f.key),
          tag: tagVal?.map((f) => f.key),
        },
        { page: page, perPage: 100 }
      );
    };

    return fetchAllPages<Application, ApplicationPage>(
      getApplicationPage,
      (responseData) => applicationPageMapper(responseData).data,
      (responseData) => applicationPageMapper(responseData).meta.count
    );
  }, [filtersValue]);

  const {
    data: applications,
    // isFetching,
    // fetchError,
    requestFetch: refreshTable,
  } = useFetch<Application[]>({
    defaultIsFetching: true,
    onFetchPromise: fetchApplications,
  });

  useEffect(() => {
    refreshTable();
  }, [filtersValue, refreshTable]);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{t("terms.reports")}</Text>
        </TextContent>
        <Toolbar clearAllFilters={clearAllFilters}>
          <ToolbarContent>
            <ApplicationToolbarToggleGroup
              value={filtersValue as Map<ApplicationFilterKey, ToolbarChip[]>}
              addFilter={addFilter}
              setFilter={setFilter}
            />
            {/* <ToolbarGroup variant="icon-button-group">
              <ToolbarItem>
                <Button variant="plain" aria-label="clone">
                  <ExternalLinkAltIcon />
                </Button>
              </ToolbarItem>
            </ToolbarGroup> */}
            <ToolbarGroup alignment={{ default: "alignRight" }}>
              <ToolbarItem variant={ToolbarItemVariant.pagination}>
                {applications ? applications.length : 0} items
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection>
        <Stack hasGutter>
          <StackItem>
            <Card>
              <CardHeader>
                <TextContent>
                  <Text component="h3">Current landscape</Text>
                </TextContent>
              </CardHeader>
              <CardBody>
                <Bullseye>
                  <Level>
                    <LevelItem>
                      <div style={{ height: "230px", width: "230px" }}>
                        <ChartDonut
                          ariaDesc="Average number of pets"
                          ariaTitle="Donut chart example"
                          constrainToVisibleArea={true}
                          data={[
                            { x: "Cats", y: 35 },
                            { x: "Dogs", y: 55 },
                            { x: "Birds", y: 10 },
                          ]}
                          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                          subTitle="Pets"
                          title="100"
                        />
                      </div>
                    </LevelItem>
                    <LevelItem>
                      <div style={{ height: "230px", width: "230px" }}>
                        <ChartDonut
                          ariaDesc="Average number of pets"
                          ariaTitle="Donut chart example"
                          constrainToVisibleArea={true}
                          data={[
                            { x: "Cats", y: 35 },
                            { x: "Dogs", y: 55 },
                            { x: "Birds", y: 10 },
                          ]}
                          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                          subTitle="Pets"
                          title="100"
                          themeColor="green"
                        />
                      </div>
                    </LevelItem>
                    <LevelItem>
                      <div style={{ height: "230px", width: "230px" }}>
                        <ChartDonut
                          ariaDesc="Average number of pets"
                          ariaTitle="Donut chart example"
                          constrainToVisibleArea={true}
                          data={[
                            { x: "Cats", y: 35 },
                            { x: "Dogs", y: 55 },
                            { x: "Birds", y: 10 },
                          ]}
                          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                          subTitle="Pets"
                          title="100"
                          themeColor="multi"
                        />
                      </div>
                    </LevelItem>
                  </Level>
                </Bullseye>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card>
              <CardHeader>
                <TextContent>
                  <Text component="h3">Adoption candidate distribution</Text>
                </TextContent>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};
