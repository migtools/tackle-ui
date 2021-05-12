import React from "react";
import { useTranslation } from "react-i18next";

import { SelectVariant, ToolbarChip } from "@patternfly/react-core";

import { SimpleSelect } from "shared/components";
import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";

export interface ISelectRiskFilterProps {
  value?: (string | ToolbarChip)[];
  onChange: (values: (string | ToolbarChip)[]) => void;
}

export const SelectRiskFilter: React.FC<ISelectRiskFilterProps> = ({
  value = [],
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleSelect
      variant={SelectVariant.checkbox}
      aria-label="risk"
      aria-labelledby="risk"
      placeholderText={t("terms.risk")}
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      value={value}
      options={[]}
      onChange={() => {}}
      hasInlineFilter
      onClear={() => onChange([])}
    />
  );
};
