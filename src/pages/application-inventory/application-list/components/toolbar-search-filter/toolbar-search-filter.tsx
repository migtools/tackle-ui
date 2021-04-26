import React, { useState } from "react";

import { InputGroup } from "@patternfly/react-core";
import { SimpleFilterDropdown } from "shared/components";

interface FilterOption {
  key: string;
  name: React.ReactNode;
}

interface FilterInput {
  key: string;
  input: React.ReactNode;
}

export interface SearchFilterProps {
  options: FilterOption[];
  filterInputs: FilterInput[];
}

export const ToolbarSearchFilter: React.FC<SearchFilterProps> = ({
  options,
  filterInputs,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(options[0].key);

  const selectedFilter = options.find((f) => f.key === selectedKey);
  const selectedFilterInput = filterInputs.find((f) => f.key === selectedKey);

  return (
    <InputGroup>
      <SimpleFilterDropdown
        label={selectedFilter?.name}
        options={[...options]}
        onSelect={(dropdown) => setSelectedKey(dropdown.key)}
      />
      {selectedFilterInput?.input}
    </InputGroup>
  );
};
