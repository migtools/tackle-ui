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
          return (
            <>
              {isLastStep ? (
                <Button
                  variant="primary"
                  onClick={onSave}
                  isDisabled={
                    !activeStep.enableNext || isDisabled || isFormInvalid
                  }
                >
                  {t("actions.save")}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={onNext}
                  isDisabled={
                    !activeStep.enableNext || isDisabled || isFormInvalid
                  }
                >
                  {t("actions.next")}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={onBack}
                isDisabled={isFirstStep || isDisabled || isFormInvalid}
              >
                {t("actions.back")}
              </Button>
              <Button variant="link" onClick={onClose} isDisabled={isDisabled}>
                {t("actions.cancel")}
              </Button>
              <Button
                variant="link"
                onClick={onSaveAsDraft}
                isDisabled={isDisabled || isFormInvalid}
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
