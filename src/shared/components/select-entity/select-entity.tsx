import React, { useCallback, useState } from "react";
import { AxiosError } from "axios";

import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectProps,
  SelectVariant,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";

import { getAxiosErrorMessage } from "utils/utils";

interface ConfigProps {
  isMulti: boolean;

  value?: SelectOptionObject | SelectOptionObject[];
  options: SelectOptionObject[];
  isFetching?: boolean;
  fetchError?: AxiosError;
  onSelect: (value: SelectOptionObject | SelectOptionObject[]) => void;
  onClear: () => void;

  isEqual: (a: SelectOptionObject, b: SelectOptionObject) => boolean;
}

/**
 * Properties that will be implemented in this component and will not come from outside
 */
interface OverridedSelectProps {
  toggleIcon?: React.ReactElement;
  variant?: "single" | "checkbox" | "typeahead" | "typeaheadmulti";
  onToggle: (isExpanded: boolean) => void;
  onSelect?: (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => void;
  onClear?: (event: React.MouseEvent) => void;
  selections?: string | SelectOptionObject | (string | SelectOptionObject)[];
  isOpen?: boolean;
  customContent?: React.ReactNode;
}

type ExcludeProps<T, Y> = Pick<T, Exclude<keyof T, keyof Y>>;
type AdditionalSelectProps = ExcludeProps<SelectProps, ConfigProps>;

//

type RequiredSelectProps = ExcludeProps<
  AdditionalSelectProps,
  OverridedSelectProps
>;

export type SelectEntityProps = ConfigProps & RequiredSelectProps;
export const SelectEntity: React.FC<SelectEntityProps> = ({
  isMulti,

  value,
  options,
  isFetching,
  fetchError,
  onSelect,
  onClear,

  isEqual,

  ...props
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

    const selectedOption = selection as SelectOptionObject;

    if (isMulti) {
      let currentValue: SelectOptionObject[];
      if (Array.isArray(value)) {
        currentValue = [...value];
      } else if (!value) {
        currentValue = [];
      } else {
        throw new Error("Current value is not an array neither null/undefined");
      }

      if (currentValue.find((f) => isEqual(f, selectedOption))) {
        onSelect(currentValue.filter((f) => !isEqual(f, selectedOption)));
      } else {
        onSelect([...currentValue, selectedOption]);
      }
    } else {
      onSelect(selectedOption);
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
      selections={value}
      isOpen={isOpen}
      customContent={customContent}
      {...props}
    >
      {options.map((elem, index) => (
        <SelectOption key={index} value={elem} />
      ))}
    </Select>
  );
};
