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
  options: FilterOption[];
  filtersValue: Map<string, string[]>;
  onDeleteFilter: (key: string, value: string[]) => void;

  children: React.ReactNode;
}

export const AppTableToolbarToggleGroup: React.FC<AppTableToolbarToggleGroupProps> = ({
  options,
  filtersValue,
  children,
  onDeleteFilter,
}) => {
  const handleOnDeleteChip = (
    category: string | ToolbarChipGroup,
    chip: ToolbarChip | string
  ) => {
    if (typeof chip !== "string") {
      throw new Error("Can not delete filter. Chip must be a string");
    }

    let categoryKey: string;
    if (typeof category === "string") {
      categoryKey = category;
    } else {
      categoryKey = category.key;
    }

    const currentFilters = filtersValue.get(categoryKey);
    if (!currentFilters) {
      throw new Error("Could not find category");
    }

    onDeleteFilter(
      categoryKey,
      currentFilters.filter((f) => f !== chip)
    );
  };

  const handleOnDeleteChipGroup = (category: string | ToolbarChipGroup) => {
    let categoryKey: string;
    if (typeof category === "string") {
      categoryKey = category;
    } else {
      categoryKey = category.key;
    }

    onDeleteFilter(categoryKey, []);
  };

  return (
    <ToolbarGroup variant="filter-group">
      {options.map((elem, index) => (
        <ToolbarFilter
          key={index}
          chips={filtersValue.get(elem.key)}
          deleteChip={handleOnDeleteChip}
          deleteChipGroup={handleOnDeleteChipGroup}
          categoryName={{ key: elem.key, name: elem.name }}
          showToolbarItem={index === options.length - 1 ? true : false}
        >
          {index === options.length - 1 ? children : null}
        </ToolbarFilter>
      ))}
    </ToolbarGroup>
  );
};
