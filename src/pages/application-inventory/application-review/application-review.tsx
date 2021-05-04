import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Grid, GridItem, PageSection, Text } from "@patternfly/react-core";

import { PageHeader } from "shared/components";

import { Paths, ReviewRoute } from "Paths";

import {
  getApplicationById,
  getAssessmentById,
  getAssessments,
} from "api/rest";
import { Application, Assessment } from "api/models";

import { ApplicationDetails } from "./components/application-details";
import { ReviewForm } from "./components/review-form";

export const ApplicationReview: React.FC = () => {
  const { t } = useTranslation();
  const { applicationId } = useParams<ReviewRoute>();

  const [application, setApplication] = useState<Application>();
  const [assessment, setAssessment] = useState<Assessment>();

  useEffect(() => {
    getApplicationById(applicationId).then(({ data }) => {
      setApplication(data);
    });
  }, [applicationId]);

  useEffect(() => {
    getAssessments({ applicationId: 1 })
      .then(({ data }) => {
        return data[0] ? getAssessmentById(data[0].id!) : undefined;
      })
      .then((assessmentResponse) => {
        if (assessmentResponse) {
          setAssessment(assessmentResponse.data);
        }
      });
  }, [application]);

  return (
    <>
      <PageSection variant="light">
        <PageHeader
          title={t("terms.review")}
          description={
            <Text component="p">
              Use this section to provide your assessment of the possible
              migration/modernization plan and effort estimation.
            </Text>
          }
          breadcrumbs={[
            {
              title: t("terms.applications"),
              path: Paths.applicationInventory_applicationList,
            },
            {
              title: t("terms.review"),
              path: Paths.applicationInventory_review,
            },
          ]}
          menuActions={[]}
        />
      </PageSection>
      <PageSection variant="light">
        <ApplicationDetails application={application} assessment={assessment} />
      </PageSection>
      <PageSection variant="light">
        <Grid>
          <GridItem span={6}>
            <ReviewForm />
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection>table</PageSection>
    </>
  );
};
