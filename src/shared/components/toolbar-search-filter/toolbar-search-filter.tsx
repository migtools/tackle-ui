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

import { InputGroup } from "@patternfly/react-core";
import { SimpleFilterDropdown } from "shared/components";

interface FilterOption {
  key: string;
  name: React.ReactNode;
  input: React.ReactNode;
}

export interface IToolbarSearchFilterProps {
  filters: FilterOption[];
}

export const ToolbarSearchFilter: React.FC<IToolbarSearchFilterProps> = ({
  filters,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | undefined>(
    filters.length > 0 ? filters[0].key : undefined
  );

  const selectedFilter = filters.find((f) => f.key === selectedKey);

  return (
    <InputGroup>
      <SimpleFilterDropdown
        label={selectedFilter?.name}
        options={filters.map((f) => ({ key: f.key, name: f.name }))}
        onSelect={(dropdown) => setSelectedKey(dropdown.key)}
      />
      {selectedFilter?.input}
    </InputGroup>
  );
};
