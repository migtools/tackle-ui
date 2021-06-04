import React from "react";
import { useTranslation } from "react-i18next";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
} from "@patternfly/react-core";

import { EmptyTextMessage } from "shared/components";

import {
  DEFAULT_EFFORTS,
  DEFAULT_PROPOSED_ACTIONS,
  Effort,
  ProposedAction,
} from "Constants";
import { Application } from "api/models";

import { ApplicationTags } from "../application-tags/application-tags";

export interface IApplicationListExpandedAreaProps {
  application: Application;
}

export const ApplicationListExpandedArea: React.FC<IApplicationListExpandedAreaProps> = ({
  application,
}) => {
  const { t } = useTranslation();

  const notYetReviewed = (
    <EmptyTextMessage message={t("terms.notYetReviewed")} />
  );
  const reviewToShown = application.review
    ? {
        proposedAction: (
          <Label>
            {DEFAULT_PROPOSED_ACTIONS.get(
              application.review.proposedAction as ProposedAction
            )}
          </Label>
        ),
        effortEstimate: DEFAULT_EFFORTS.get(
          application.review.effortEstimate as Effort
        )?.label,
        criticality: application.review.businessCriticality,
        workPriority: application.review.workPriority,
        comments: application.review.comments,
      }
    : {
        proposedAction: notYetReviewed,
        effortEstimate: notYetReviewed,
        criticality: notYetReviewed,
        workPriority: notYetReviewed,
        comments: notYetReviewed,
      };

  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.tags")}</DescriptionListTerm>
        <DescriptionListDescription cy-data="tags">
          <ApplicationTags application={application} />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.comments")}</DescriptionListTerm>
        <DescriptionListDescription cy-data="comments">
          {application.comments}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.proposedAction")}</DescriptionListTerm>
        <DescriptionListDescription cy-data="proposed-action">
          {reviewToShown.proposedAction}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.effortEstimate")}</DescriptionListTerm>
        <DescriptionListDescription cy-data="effort-estimate">
          {reviewToShown.effortEstimate}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>
          {t("terms.businessCriticality")}
        </DescriptionListTerm>
        <DescriptionListDescription cy-data="business-criticality">
          {reviewToShown.criticality}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.workPriority")}</DescriptionListTerm>
        <DescriptionListDescription cy-data="work-priority">
          {reviewToShown.workPriority}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.reviewComments")}</DescriptionListTerm>
        <DescriptionListDescription cy-data="review-comments">
          {reviewToShown.comments}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
