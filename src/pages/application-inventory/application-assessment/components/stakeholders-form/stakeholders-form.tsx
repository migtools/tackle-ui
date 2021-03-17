import React from "react";
import { useTranslation } from "react-i18next";
import { useFormikContext } from "formik";

import {
  Form,
  FormGroup,
  FormSection,
  SelectOptionObject,
  Text,
  TextContent,
} from "@patternfly/react-core";

import { SelectEntityFormikField } from "shared/components";

import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";
import { getValidatedFromError } from "utils/utils";

import { IFormValues } from "../../application-assessment";
import { Stakeholder, StakeholderGroup } from "api/models";
import { AxiosError } from "axios";

export interface StakeholdersFormProps {
  stakeholders?: Stakeholder[];
  isFetchingStakeholders: boolean;
  fetchErrorStakeholders?: AxiosError;
  toSelectOptionStakeholder: (item: Stakeholder) => SelectOptionObject;
  isSelectOptionStakeholderEqual: (
    a: SelectOptionObject,
    b: SelectOptionObject
  ) => boolean;

  stakeholderGroups?: StakeholderGroup[];
  isFetchingStakeholderGroups: boolean;
  fetchErrorStakeholderGroups?: AxiosError;
  toSelectOptionStakeholderGroup: (
    item: StakeholderGroup
  ) => SelectOptionObject;
  isSelectOptionStakeholderGroupEqual: (
    a: SelectOptionObject,
    b: SelectOptionObject
  ) => boolean;
}

export const StakeholdersForm: React.FC<StakeholdersFormProps> = ({
  stakeholders,
  isFetchingStakeholders,
  fetchErrorStakeholders,
  toSelectOptionStakeholder,
  isSelectOptionStakeholderEqual,

  stakeholderGroups,
  isFetchingStakeholderGroups,
  fetchErrorStakeholderGroups,
  toSelectOptionStakeholderGroup,
  isSelectOptionStakeholderGroupEqual,
}) => {
  const { t } = useTranslation();
  const formik = useFormikContext<IFormValues>();

  return (
    <div className="pf-c-form">
      <FormSection>
        <TextContent>
          <Text component="h1">Select stakeholders</Text>
          <Text component="p">
            Select the stakeholder(s) or stakeholder group(s) associated with
            this assessment.
          </Text>
        </TextContent>
      </FormSection>
      <FormSection>
        <FormGroup
          label={t("terms.stakeholders")}
          fieldId="stakeholders"
          isRequired={false}
          validated={getValidatedFromError(formik.errors.stakeholders)}
          helperTextInvalid={formik.errors.stakeholders}
        >
          <SelectEntityFormikField
            fieldConfig={{
              name: "stakeholders",
            }}
            selectConfig={{
              isMulti: true,
              options: (stakeholders || []).map((f) =>
                toSelectOptionStakeholder(f)
              ),
              isEqual: isSelectOptionStakeholderEqual,

              isFetching: isFetchingStakeholders,
              fetchError: fetchErrorStakeholders,

              maxHeight: DEFAULT_SELECT_MAX_HEIGHT,
              placeholderText: "Select stakeholder(s)",
              "aria-label": "stakeholders",
              "aria-describedby": "stakeholders",
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.stakeholderGroups")}
          fieldId="stakeholderGroups"
          isRequired={false}
          validated={getValidatedFromError(formik.errors.stakeholderGroups)}
          helperTextInvalid={formik.errors.stakeholderGroups}
        >
          <SelectEntityFormikField
            fieldConfig={{
              name: "stakeholderGroups",
            }}
            selectConfig={{
              isMulti: true,
              options: (stakeholderGroups || []).map((f) =>
                toSelectOptionStakeholderGroup(f)
              ),
              isEqual: isSelectOptionStakeholderGroupEqual,

              isFetching: isFetchingStakeholderGroups,
              fetchError: fetchErrorStakeholderGroups,

              maxHeight: DEFAULT_SELECT_MAX_HEIGHT,
              placeholderText: "Select stakeholder group(s)",
              "aria-label": "stakeholder-groups",
              "aria-describedby": "stakeholder-groups",
            }}
          />
        </FormGroup>
      </FormSection>
    </div>
  );
};
