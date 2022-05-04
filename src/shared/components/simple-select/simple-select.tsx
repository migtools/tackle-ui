/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { useState } from "react";

import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectOptionProps,
  SelectProps,
} from "@patternfly/react-core";

export interface OptionWithValue<T = string> extends SelectOptionObject {
  value: T;
  props?: Partial<SelectOptionProps>; // Extra props for <SelectOption>, e.g. children, className
}

type OptionLike = string | SelectOptionObject | OptionWithValue;

export interface ISimpleSelectProps
  extends Omit<
    SelectProps,
    "onChange" | "isOpen" | "onToggle" | "onSelect" | "selections" | "value"
  > {
  "aria-label": string;
  onChange: (selection: OptionLike) => void;
  options: OptionLike[];
  value?: OptionLike | OptionLike[];
}

export const SimpleSelect: React.FC<ISimpleSelectProps> = ({
  onChange,
  options,
  value,
  placeholderText = "Select...",

  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Select
      placeholderText={placeholderText}
      isOpen={isOpen}
      onToggle={setIsOpen}
      onSelect={(_, selection: OptionLike) => {
        onChange(selection);
        if (props.variant !== "checkbox") {
          setIsOpen(false);
        }
      }}
      selections={value}
      {...props}
    >
      {options.map((option, index) => (
        <SelectOption
          key={`${index}-${option.toString()}`}
          value={option}
          {...(typeof option === "object" && (option as OptionWithValue).props)}
        />
      ))}
    </Select>
  );
};
