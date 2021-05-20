import React from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  WizardContextConsumer,
  WizardFooter,
} from "@patternfly/react-core";

export interface CustomWizardFooterProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isDisabled: boolean;
  isFormInvalid: boolean;
  onSave: () => void;
  onSaveAsDraft: () => void;
}

export const CustomWizardFooter: React.FC<CustomWizardFooterProps> = ({
  isFirstStep,
  isLastStep,
  isDisabled,
  isFormInvalid,
  onSave,
  onSaveAsDraft,
}) => {
  const { t } = useTranslation();

  return (
    <WizardFooter>
      <WizardContextConsumer>
        {({ onNext, onBack, onClose, activeStep }) => {
          const enableNext =
            activeStep && activeStep.enableNext !== undefined
              ? activeStep.enableNext
              : true;

          return (
            <>
              {isLastStep ? (
                <Button
                  variant="primary"
                  onClick={onSave}
                  isDisabled={!enableNext || isDisabled || isFormInvalid}
                  cy-data="next"
                >
                  {t("actions.save")}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={onNext}
                  isDisabled={!enableNext || isDisabled || isFormInvalid}
                  cy-data="next"
                >
                  {t("actions.next")}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={onBack}
                isDisabled={isFirstStep || isDisabled || isFormInvalid}
                cy-data="back"
              >
                {t("actions.back")}
              </Button>
              <Button
                variant="link"
                onClick={onClose}
                isDisabled={isDisabled}
                cy-data="cancel"
              >
                {t("actions.cancel")}
              </Button>
              <Button
                variant="link"
                onClick={onSaveAsDraft}
                isDisabled={isDisabled || isFormInvalid}
                cy-data="save-as-draft"
              >
                {t("actions.saveAsDraft")}
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );
};
