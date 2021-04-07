import React from "react";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import {
  StatusIconAssessment,
  StatusIconAssessmentType,
} from "shared/components";
import { Application, Assessment, BusinessService } from "api/models";
import { RemoteAssessment } from "../remote-assessment";

export interface ChildrenProps {
  businessService?: BusinessService;
  isFetching: boolean;
  fetchError?: AxiosError;
}

export interface ApplicationAssessmentProps {
  application: Application;
}

const getStatusIconFrom = (
  assessment: Assessment
): StatusIconAssessmentType => {
  switch (assessment.status) {
    case "EMPTY":
      return "NotStarted";
    case "STARTED":
      return "InProgress";
    case "COMPLETE":
      return "Completed";
    default:
      return "NotStarted";
  }
};

export const ApplicationAssessment: React.FC<ApplicationAssessmentProps> = ({
  application,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {application.id && (
        <RemoteAssessment applicationId={application.id}>
          {({ isFetching, fetchError, fetchCount, assessment }) => {
            if (fetchError) {
              return t("terms.unknown");
            }
            if (isFetching || fetchCount === 0) {
              return "";
            }

            return assessment ? (
              <StatusIconAssessment status={getStatusIconFrom(assessment)} />
            ) : (
              <StatusIconAssessment status="NotStarted" />
            );
          }}
        </RemoteAssessment>
      )}
    </>
  );
};
