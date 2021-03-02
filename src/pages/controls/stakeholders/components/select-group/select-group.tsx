import React, { useCallback, useState } from "react";
import { AxiosError } from "axios";

import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";

import { StakeholderGroup } from "api/models";
import { getAxiosErrorMessage } from "utils/utils";

interface SelectOptionStakeholder extends SelectOptionObject {
  group: StakeholderGroup;
}

const selectOptionMapper = (
  group: StakeholderGroup
): SelectOptionStakeholder => ({
  group: { ...group },
  toString: function () {
    return group.name;
  },
});

export interface SelectGroupProps {
  value?: StakeholderGroup[];
  groups: StakeholderGroup[];
  isFetching?: boolean;
  fetchError?: AxiosError;
  onSelect: (value: StakeholderGroup[]) => void;
  onClear: () => void;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({
  value,
  groups,
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

    if (value?.find((f) => f.id === selectedOption.group.id)) {
      onSelect(value.filter((f) => f.id !== selectedOption.group.id));
    } else {
      onSelect([...(value || []), selectedOption.group]);
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
      maxHeight={350}
      customContent={customContent}
      placeholderText="Select a group"
    >
      {groups
        .map((f) => selectOptionMapper(f))
        .map((elem, index) => (
          <SelectOption key={index} value={elem} />
        ))}
    </Select>
  );
};
