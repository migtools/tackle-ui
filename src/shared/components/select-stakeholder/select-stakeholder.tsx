import React, { useCallback, useState } from "react";
import { AxiosError } from "axios";

import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";

import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";
import { Stakeholder } from "api/models";
import { getAxiosErrorMessage } from "utils/utils";

interface SelectOptionStakeholder extends SelectOptionObject {
  stakeholder: Stakeholder;
}

const selectOptionMapper = (
  stakeholder?: Stakeholder
): SelectOptionStakeholder | undefined => {
  if (!stakeholder) {
    return undefined;
  }

  return {
    stakeholder: { ...stakeholder },
    toString: () => stakeholder.displayName,
  };
};

export interface SelectStakeholderProps {
  isMulti: boolean;
  placeholderText: string;

  value?: Stakeholder | Stakeholder[];
  stakeholders: Stakeholder[];
  isFetching?: boolean;
  fetchError?: AxiosError;
  onSelect: (value: Stakeholder | Stakeholder[]) => void;
  onClear: () => void;
}

export const SelectStakeholder: React.FC<SelectStakeholderProps> = ({
  isMulti,
  placeholderText,

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

    if (isMulti) {
      let currentValue: Stakeholder[];
      if (Array.isArray(value)) {
        currentValue = [...value];
      } else if (!value) {
        currentValue = [];
      } else {
        throw new Error("Current value is not an array neither null/undefined");
      }

      if (currentValue.find((f) => f.id === selectedOption.stakeholder.id)) {
        onSelect(
          currentValue.filter((f) => f.id !== selectedOption.stakeholder.id)
        );
      } else {
        onSelect([...currentValue, selectedOption.stakeholder]);
      }
    } else {
      onSelect(selectedOption.stakeholder);
    }
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
      variant={isMulti ? SelectVariant.typeaheadMulti : SelectVariant.typeahead}
      onToggle={handleOnToggle}
      onSelect={handleOnSelect}
      onClear={handleOnClearSelection}
      selections={
        Array.isArray(value)
          ? value.map((f) => selectOptionMapper(f))
          : selectOptionMapper(value)
      }
      isOpen={isOpen}
      menuAppendTo={() => document.body}
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      customContent={customContent}
      placeholderText={placeholderText}
    >
      {stakeholders
        .map((f) => selectOptionMapper(f))
        .map((elem, index) => (
          <SelectOption key={index} value={elem} />
        ))}
    </Select>
  );
};
