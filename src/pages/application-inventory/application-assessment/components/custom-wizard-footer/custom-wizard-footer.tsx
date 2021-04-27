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
}

export const CustomWizardFooter: React.FC<CustomWizardFooterProps> = ({
  isFirstStep,
  isDisabled,
  isNextDisabled,
}) => {
  const { t } = useTranslation();

  return (
    <WizardFooter>
      <WizardContextConsumer>
        {({ onNext, onBack, onClose }) => {
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
              <Button variant="link" onClick={onClose} isDisabled={isDisabled}>
                {t("actions.cancel")}
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );
};
