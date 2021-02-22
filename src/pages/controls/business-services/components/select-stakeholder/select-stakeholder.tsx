import React, { useCallback, useState } from "react";
import { AxiosError } from "axios";

import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";

import { Stakeholder } from "api/models";
import { getAxiosErrorMessage } from "utils/utils";

interface SelectOptionStakeholder extends SelectOptionObject {
  stakeholder: Stakeholder;
}

const selectOptionMapper = (
  stakeholder: Stakeholder
): SelectOptionStakeholder => ({
  stakeholder: { ...stakeholder },
  toString: () => stakeholder.displayName,
});

export interface SelectStakeholderProps {
  value?: Stakeholder;
  stakeholders: Stakeholder[];
  isFetching?: boolean;
  fetchError?: AxiosError;
  onSelect: (value: Stakeholder) => void;
  onClear: () => void;
}

export const SelectStakeholder: React.FC<SelectStakeholderProps> = ({
  value,
  stakeholders,
  isFetching,
  fetchError,
  onSelect,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnToggle = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);

  const handleOnSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject
  ) => {
    if (typeof selection === "string") {
      throw new Error("This selection is not allowed");
    }

    setIsOpen(false);

    const selectedOption = selection as SelectOptionStakeholder;
    onSelect(selectedOption.stakeholder);
  };

  const handleOnClearSelection = () => {
    onClear();
  };

  let customContent;
  if (isFetching) {
    customContent = <div>&nbsp;Loading...</div>;
  } else if (fetchError) {
    customContent = <div>&nbsp;{getAxiosErrorMessage(fetchError)}</div>;
  }

  return (
    <Select
      toggleIcon={fetchError && <WarningTriangleIcon />}
      variant={SelectVariant.typeahead}
      onToggle={handleOnToggle}
      onSelect={handleOnSelect}
      onClear={handleOnClearSelection}
      selections={value ? value.displayName : undefined}
      isOpen={isOpen}
      menuAppendTo={() => document.body}
      maxHeight={350}
      customContent={customContent}
    >
      {stakeholders
        .map((f) => selectOptionMapper(f))
        .map((elem, index) => (
          <SelectOption key={index} value={elem}>
            {elem.stakeholder.displayName}
          </SelectOption>
        ))}
    </Select>
  );
};
