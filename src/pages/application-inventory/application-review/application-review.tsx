import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

import { Bullseye, FormSection, Grid, GridItem } from "@patternfly/react-core";
import { BanIcon } from "@patternfly/react-icons";

import {
  AppPlaceholder,
  ConditionalRender,
  SimpleEmptyState,
} from "shared/components";

import { Paths, ReviewRoute } from "Paths";

import {
  getApplicationById,
  getAssessmentById,
  getAssessments,
  getReviewId,
} from "api/rest";
import { Application, Assessment, Review } from "api/models";

import { ReviewForm } from "./components/review-form";
import { ApplicationDetails } from "./components/application-details";
import { ApplicationAssessmentDonutChart } from "./components/application-assessment-donut-chart";
import { ApplicationReviewPage } from "./components/application-review-page";

export const ApplicationReview: React.FC = () => {
  const { t } = useTranslation();

  const history = useHistory();
  const { applicationId } = useParams<ReviewRoute>();

  // Application and review

  const [
    isApplicationAndReviewFetching,
    setIsFetchingApplicationAndReview,
  ] = useState(true);
  const [
    fetchErrorApplicationAndReview,
    setFetchErrorApplicationAndReview,
  ] = useState<AxiosError>();

  const [application, setApplication] = useState<Application>();
  const [review, setReview] = useState<Review>();

  // Assessment
  const [assessment, setAssessment] = useState<Assessment>();

  // Start fetch

  useEffect(() => {
    if (applicationId) {
      setIsFetchingApplicationAndReview(true);

      getApplicationById(applicationId)
        .then(({ data }) => {
          setApplication(data);
          return data.review ? getReviewId(data.review.id!) : undefined;
        })
        .then((response) => {
          if (response) {
            setReview(response.data);
          }

          setIsFetchingApplicationAndReview(false);
          setFetchErrorApplicationAndReview(undefined);
        })
        .catch((error) => {
          setIsFetchingApplicationAndReview(false);
          setFetchErrorApplicationAndReview(error);
        });
    }
  }, [applicationId]);

  useEffect(() => {
    if (applicationId) {
      getAssessments({ applicationId: applicationId })
        .then(({ data }) => {
          return data[0] ? getAssessmentById(data[0].id!) : undefined;
        })
        .then((assessmentResponse) => {
          if (assessmentResponse) {
            setAssessment(assessmentResponse.data);
          }
        });
    }
  }, [applicationId]);

  const redirectToApplicationList = () => {
    history.push(Paths.applicationInventory_applicationList);
  };

  if (fetchErrorApplicationAndReview) {
    return (
      <ApplicationReviewPage>
        <Bullseye>
          <SimpleEmptyState
            icon={BanIcon}
            title={t("message.couldNotFetchTitle")}
            description={t("message.couldNotFetchBody") + "."}
          />
        </Bullseye>
      </ApplicationReviewPage>
    );
  }

  return (
    <ApplicationReviewPage>
      <ConditionalRender
        when={isApplicationAndReviewFetching}
        then={<AppPlaceholder />}
      >
        <Grid hasGutter>
          {application && (
            <GridItem md={5}>
              <div className="pf-c-form">
                <FormSection>
                  <ApplicationDetails
                    application={application}
                    assessment={assessment}
                  />
                </FormSection>
                <FormSection>
                  <ReviewForm
                    application={application}
                    review={review}
                    onSaved={redirectToApplicationList}
                    onCancel={redirectToApplicationList}
                  />
                </FormSection>
              </div>
            </GridItem>
          )}
          <GridItem md={1}></GridItem>
          {assessment && (
            <GridItem md={6}>
              <ApplicationAssessmentDonutChart assessment={assessment} />
            </GridItem>
          )}
        </Grid>
      </ConditionalRender>
    </ApplicationReviewPage>
  );
};
