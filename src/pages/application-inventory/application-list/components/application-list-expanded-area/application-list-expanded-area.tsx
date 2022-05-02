/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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

import { EFFORT_ESTIMATE_LIST, PROPOSED_ACTION_LIST } from "Constants";
import { Application } from "api/models";

import { ApplicationTags } from "../application-tags";
import { ApplicationRisk } from "./application-risk";

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
            {PROPOSED_ACTION_LIST[application.review.proposedAction]
              ? t(
                  PROPOSED_ACTION_LIST[application.review.proposedAction].i18Key
                )
              : application.review.proposedAction}
          </Label>
        ),
        effortEstimate: EFFORT_ESTIMATE_LIST[application.review.effortEstimate]
          ? t(EFFORT_ESTIMATE_LIST[application.review.effortEstimate].i18Key)
          : application.review.effortEstimate,
        criticality: application.review.businessCriticality,
        workPriority: application.review.workPriority,
        comments: application.review.comments,
      }
    : {
        proposedAction: notYetReviewed,
        effortEstimate: notYetReviewed,
        criticality: notYetReviewed,
        workPriority: notYetReviewed,
        notYetReviewed: notYetReviewed,
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
        <DescriptionListTerm>{t("terms.risk")}</DescriptionListTerm>
        <DescriptionListDescription cy-data="risk">
          <ApplicationRisk application={application} />
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
