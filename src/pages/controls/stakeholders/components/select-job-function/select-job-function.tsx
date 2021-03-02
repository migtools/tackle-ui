import React, { useCallback, useState } from "react";
import { AxiosError } from "axios";

import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";

import { JobFunction } from "api/models";
import { getAxiosErrorMessage } from "utils/utils";

interface SelectOptionJobFunction extends SelectOptionObject {
  jobFunction: JobFunction;
}

const selectOptionMapper = (
  jobFunction: JobFunction
): SelectOptionJobFunction => ({
  jobFunction: { ...jobFunction },
  toString: () => jobFunction.name,
});

export interface SelectJobFunctionProps {
  value?: JobFunction;
  jobFunctions: JobFunction[];
  isFetching?: boolean;
  fetchError?: AxiosError;
  onSelect: (value: JobFunction) => void;
  onClear: () => void;
}

export const SelectJobFunction: React.FC<SelectJobFunctionProps> = ({
  value,
  jobFunctions,
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

    const selectedOption = selection as SelectOptionJobFunction;
    onSelect(selectedOption.jobFunction);
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
      selections={value ? value.name : undefined}
      isOpen={isOpen}
      menuAppendTo={() => document.body}
      maxHeight={350}
      customContent={customContent}
      placeholderText="Select a job function"
      isCreatable={true}
    >
      {jobFunctions
        .map((f) => selectOptionMapper(f))
        .map((elem, index) => (
          <SelectOption key={index} value={elem}>
            {elem.jobFunction.name}
          </SelectOption>
        ))}
    </Select>
  );
};
