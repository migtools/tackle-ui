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
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
} from "@patternfly/react-core";
import { FilterIcon } from "@patternfly/react-icons";

export interface DropdownOption {
  key: string;
  name: React.ReactNode;
}

export interface SimpleFilterDropdownProps {
  label: React.ReactNode;
  options: DropdownOption[];
  onSelect: (key: DropdownOption) => void;
}

export const SimpleFilterDropdown: React.FC<SimpleFilterDropdownProps> = ({
  label,
  options,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnSelect = () => {
    setIsOpen((current) => !current);
  };

  const handleOnToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Dropdown
      position={DropdownPosition.left}
      isOpen={isOpen}
      onSelect={handleOnSelect}
      toggle={
        <DropdownToggle onToggle={handleOnToggle}>
          <FilterIcon /> {label}
        </DropdownToggle>
      }
      dropdownItems={options.map((elem, index) => (
        <DropdownItem
          key={index}
          component="button"
          onClick={() => onSelect(elem)}
        >
          {elem.name}
        </DropdownItem>
      ))}
    />
  );
};
