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
import React from "react";
import {
  ToolbarChip,
  ToolbarChipGroup,
  ToolbarFilter,
  ToolbarGroup,
} from "@patternfly/react-core";

interface FilterOption {
  key: string;
  name: string;
}

export interface AppTableToolbarToggleGroupProps {
  categories: (string | FilterOption)[];
  chips: Map<string, (string | ToolbarChip)[]>;
  onChange: (key: string, value: (string | ToolbarChip)[]) => void;

  children: React.ReactNode;
}

export const AppTableToolbarToggleGroup: React.FC<AppTableToolbarToggleGroupProps> = ({
  categories,
  chips,
  children,
  onChange,
}) => {
  const handleOnDeleteChip = (
    category: string | ToolbarChipGroup,
    chip: ToolbarChip | string
  ) => {
    let categoryKey: string;
    if (typeof category === "string") {
      categoryKey = category;
    } else {
      categoryKey = category.key;
    }

    let chipKey: string;
    if (typeof chip === "string") {
      chipKey = chip;
    } else {
      chipKey = chip.key;
    }

    const currentFilters = chips.get(categoryKey);
    if (!currentFilters) {
      throw new Error("Could not find category");
    }

    const newFilters = currentFilters.filter((f) => {
      if (typeof f === "string") {
        return f !== chipKey;
      } else {
        return f.key !== chipKey;
      }
    });

    onChange(categoryKey, newFilters);
  };

  const handleOnDeleteChipGroup = (category: string | ToolbarChipGroup) => {
    let categoryKey: string;
    if (typeof category === "string") {
      categoryKey = category;
    } else {
      categoryKey = category.key;
    }

    onChange(categoryKey, []);
  };

  return (
    <ToolbarGroup variant="filter-group">
      {categories.map((elem, index) => (
        <ToolbarFilter
          key={index}
          chips={
            typeof elem === "string" ? chips.get(elem) : chips.get(elem.key)
          }
          deleteChip={handleOnDeleteChip}
          deleteChipGroup={handleOnDeleteChipGroup}
          categoryName={elem}
          showToolbarItem={index === categories.length - 1 ? true : false}
        >
          {index === categories.length - 1 ? children : null}
        </ToolbarFilter>
      ))}
    </ToolbarGroup>
  );
};
