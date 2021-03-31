import React from "react";
import { useTranslation } from "react-i18next";

import { Button, ButtonVariant } from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";

export interface WizardFooterProps {
  isFirstStep: boolean;
  isDisabled?: boolean;
  isNextDisabled?: boolean;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({
  isFirstStep,
  isDisabled,
  isNextDisabled,
  onBack,
  onNext,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <footer className={css(styles.wizardFooter)}>
      <Button
        variant={ButtonVariant.primary}
        onClick={onNext}
        isDisabled={isDisabled ? isDisabled : isNextDisabled}
      >
        {t("actions.next")}
      </Button>
      {!isFirstStep && (
        <Button
          variant={ButtonVariant.secondary}
          onClick={onBack}
          isDisabled={isDisabled}
        >
          {t("actions.back")}
        </Button>
      )}
      <Button
        variant={ButtonVariant.link}
        onClick={onCancel}
        isDisabled={isDisabled}
      >
        {t("actions.cancel")}
      </Button>
    </footer>
  );
};
