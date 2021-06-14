import React, { useState } from "react";

import { Button, InputGroup, TextInput } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

export interface InputTextFilterProps {
  onApplyFilter: (filterText: string) => void;
}

export const InputTextFilter: React.FC<InputTextFilterProps> = ({
  onApplyFilter,
}) => {
  const [filterText, setFilterText] = useState("");

  const handleOnChangeFilterText = (value: string) => {
    setFilterText(value);
  };

  const handleOnSearch = () => {
    if (filterText.trim().length > 0) {
      onApplyFilter(filterText.trim());
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
      <TextInput
        type="text"
        value={filterText}
        onChange={handleOnChangeFilterText}
        onKeyPress={handleOnSearchKeyPress}
        placeholder="Filter..."
        aria-label="filter-text"
      />
      <Button variant="control" aria-label="search" onClick={handleOnSearch}>
        <SearchIcon />
      </Button>
    </InputGroup>
  );
};
