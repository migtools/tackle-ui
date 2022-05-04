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
import { useTranslation } from "react-i18next";

import { Button, InputGroup, TextInput } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

import { SimpleFilterDropdown } from "shared/components";
import { DropdownOption } from "shared/components/simple-filter-dropdown/simple-filter-dropdown";

interface FilterOption {
  key: string;
  name: React.ReactNode;
}

export interface SearchFilterProps {
  options: FilterOption[];
  onApplyFilter: (key: string, filterText: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  options,
  onApplyFilter,
}) => {
  const { t } = useTranslation();

  const [filterText, setFilterText] = useState("");
  const [selected, setSelected] = useState<DropdownOption>(options[0]);

  const handleOnSelect = (dropdownOption: {
    key: string;
    name: React.ReactNode;
  }) => {
    setSelected(dropdownOption);
    setFilterText("");
  };

  const handleOnChangeFilterText = (value: string) => {
    setFilterText(value);
  };

  const handleOnSearch = () => {
    if (filterText.trim().length > 0) {
      onApplyFilter(selected.key, filterText.trim());
      setFilterText("");
    }
  };

  const handleOnSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleOnSearch();
    }
  };

  return (
    <InputGroup>
      <SimpleFilterDropdown
        label={selected.name}
        options={[...options]}
        onSelect={handleOnSelect}
      />
      <TextInput
        type="text"
        value={filterText}
        onChange={handleOnChangeFilterText}
        onKeyPress={handleOnSearchKeyPress}
        placeholder={t("terms.filter")}
        aria-label="filter-text"
      />
      <Button variant="control" aria-label="search" onClick={handleOnSearch}>
        <SearchIcon />
      </Button>
    </InputGroup>
  );
};
