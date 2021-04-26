import React from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  WizardContextConsumer,
  WizardFooter,
} from "@patternfly/react-core";

export interface CustomWizardFooterProps {
  isFirstStep: boolean;
  isDisabled?: boolean;
  isNextDisabled?: boolean;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
}

export const CustomWizardFooter: React.FC<CustomWizardFooterProps> = ({
  isFirstStep,
  isDisabled,
  isNextDisabled,
  onBack,
  onNext,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <WizardFooter>
      <WizardContextConsumer>
        {() => {
          return (
            <>
              <Button
                variant="primary"
                onClick={onNext}
                isDisabled={isDisabled ? isDisabled : isNextDisabled}
              >
                {t("actions.next")}
              </Button>
              <Button
                variant="secondary"
                onClick={onBack}
                isDisabled={isDisabled}
                className={isFirstStep ? "pf-m-disabled" : ""}
              >
                {t("actions.back")}
              </Button>
              <Button variant="link" onClick={onCancel} isDisabled={isDisabled}>
                {t("actions.cancel")}
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );
};
