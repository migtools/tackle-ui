import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { SelectVariant, ToolbarChip } from "@patternfly/react-core";

import { SimpleSelectFetch, OptionWithValue } from "shared/components";
import { useFetchTagTypes } from "shared/hooks";

import { Tag } from "api/models";
import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";
import { TagTypeSortBy } from "api/rest";

const tagToToolbarChip = (value: Tag): ToolbarChip => ({
  key: `${value.id}`,
  node: value.name,
});

const tagToOption = (value: Tag): OptionWithValue<Tag> => ({
  value,
  toString: () => value.name,
  compareTo: (selectOption: any) => {
    // If "string" we are just filtering
    if (typeof selectOption === "string") {
      return value.name.toLowerCase().includes(selectOption.toLowerCase());
    }
    // If not "string" we are selecting a checkbox
    else {
      return (
        selectOption.value &&
        (selectOption as OptionWithValue<Tag>).value.id === value.id
      );
    }
  },
  props: {
    description: value.tagType?.name,
  },
});

export interface SelectTagFilterProps {
  value?: ToolbarChip[];
  onApplyFilter: (values: ToolbarChip[]) => void;
}

export const SelectTagFilter: React.FC<SelectTagFilterProps> = ({
  value = [],
  onApplyFilter,
}) => {
  const { t } = useTranslation();

  // Tag types

  const {
    tagTypes,
    isFetching: isFetchingTagTypes,
    fetchError: fetchErrorTagTypes,
    fetchAllTagTypes,
  } = useFetchTagTypes();

  useEffect(() => {
    fetchAllTagTypes({ field: TagTypeSortBy.RANK });
  }, [fetchAllTagTypes]);

  // Tags

  const [tags, setTags] = useState<Tag[]>();

  useEffect(() => {
    if (tagTypes) {
      setTags(tagTypes.data.flatMap((f) => f.tags || []));
    }
  }, [tagTypes]);

  return (
    <SimpleSelectFetch
      variant={SelectVariant.checkbox}
      aria-label="tag"
      aria-labelledby="tag"
      placeholderText={t("terms.tag")}
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      value={value
        .map((f) => (tags || []).find((b) => `${b.id}` === f.key))
        .map((f) => tagToOption(f!))}
      options={(tags || []).map(tagToOption)}
      onChange={(option) => {
        const optionValue = (option as OptionWithValue<Tag>).value;

        const elementExists = value.some((f) => f.key === `${optionValue.id}`);
        let newIds: ToolbarChip[];
        if (elementExists) {
          newIds = value.filter((f) => f.key !== `${optionValue.id}`);
        } else {
          newIds = [...value, tagToToolbarChip(optionValue)];
        }

        onApplyFilter(newIds);
      }}
      isFetching={isFetchingTagTypes}
      fetchError={fetchErrorTagTypes}
      hasInlineFilter
      onClear={() => onApplyFilter([])}
    />
  );
};