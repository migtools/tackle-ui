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
import { StakeholderGroup } from "api/models";
import { getAxiosErrorMessage } from "utils/utils";

interface SelectOptionStakeholder extends SelectOptionObject {
  stakeholderGroup: StakeholderGroup;
}

const selectOptionMapper = (
  stakeholderGroup: StakeholderGroup
): SelectOptionStakeholder => ({
  stakeholderGroup: { ...stakeholderGroup },
  toString: function () {
    return stakeholderGroup.name;
  },
});

export interface SelectGroupProps {
  value?: StakeholderGroup[];
  stakeholderGroups: StakeholderGroup[];
  isFetching?: boolean;
  fetchError?: AxiosError;
  onSelect: (value: StakeholderGroup[]) => void;
  onClear: () => void;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({
  value,
  stakeholderGroups,
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

    if (value?.find((f) => f.id === selectedOption.stakeholderGroup.id)) {
      onSelect(
        value.filter((f) => f.id !== selectedOption.stakeholderGroup.id)
      );
    } else {
      onSelect([...(value || []), selectedOption.stakeholderGroup]);
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
      variant={SelectVariant.typeaheadMulti}
      onToggle={handleOnToggle}
      onSelect={handleOnSelect}
      onClear={handleOnClearSelection}
      selections={value?.map((f) => selectOptionMapper(f))}
      isOpen={isOpen}
      menuAppendTo={() => document.body}
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      customContent={customContent}
      placeholderText="Select stakeholder groups"
    >
      {stakeholderGroups
        .map((f) => selectOptionMapper(f))
        .map((elem, index) => (
          <SelectOption key={index} value={elem} />
        ))}
    </Select>
  );
};
