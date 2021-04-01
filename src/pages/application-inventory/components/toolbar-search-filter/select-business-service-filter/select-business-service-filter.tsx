import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  SelectOption,
  SelectVariant,
  ToolbarChip,
} from "@patternfly/react-core";

import { SimpleSelectFetch, OptionWithValue } from "shared/components";
import { useFetchBusinessServices } from "shared/hooks";

import { BusinessService } from "api/models";
import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";

const businessServiceToToolbarChip = (value: BusinessService): ToolbarChip => ({
  key: `${value.id}`,
  node: value.name,
});

const businessServiceToOption = (
  value: BusinessService
): OptionWithValue<BusinessService> => ({
  value,
  toString: () => value.name,
  compareTo: (selectOption: any) => {
    return (
      typeof selectOption !== "string" &&
      selectOption.value &&
      (selectOption as OptionWithValue<BusinessService>).value.id === value.id
    );
  },
});

export interface BusinessServiceFilterProps {
  value?: ToolbarChip[];
  onApplyFilter: (values: ToolbarChip[]) => void;
}

export const SelectBusinessServiceFilter: React.FC<BusinessServiceFilterProps> = ({
  value = [],
  onApplyFilter,
}) => {
  const { t } = useTranslation();

  const [filterText, setFilterText] = useState("");

  const {
    businessServices,
    isFetching: isFetchingBusinessServices,
    fetchError: fetchErrorBusinessServices,
    fetchAllBusinessServices,
  } = useFetchBusinessServices();

  useEffect(() => {
    fetchAllBusinessServices();
  }, [fetchAllBusinessServices]);

  const handleOnFilter = (
    event: React.ChangeEvent<HTMLInputElement>
  ): React.ReactElement[] => {
    const inputText = event && event.target ? event.target.value : filterText;
    setFilterText(inputText);

    let input: RegExp;
    try {
      input = new RegExp(inputText, "i");
    } catch (err) {}

    const filteredValues =
      inputText !== ""
        ? businessServices?.data.filter((f) => input.test(f.name))
        : businessServices?.data;

    return (filteredValues || [])
      .map(businessServiceToOption)
      .map((option, index) => (
        <SelectOption key={`${index}-${option.toString()}`} value={option} />
      ));
  };

  return (
    <SimpleSelectFetch
      variant={SelectVariant.checkbox}
      aria-label="business-service"
      aria-labelledby="business-service"
      placeholderText={t("terms.businessService")}
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      value={value
        .map((f) =>
          (businessServices?.data || []).find((b) => `${b.id}` === f.key)
        )
        .map((f) => businessServiceToOption(f!))}
      options={(businessServices?.data || []).map(businessServiceToOption)}
      onChange={(option) => {
        const optionValue = (option as OptionWithValue<BusinessService>).value;

        const elementExists = value.some((f) => f.key === `${optionValue.id}`);
        let newIds: ToolbarChip[];
        if (elementExists) {
          newIds = value.filter((f) => f.key !== `${optionValue.id}`);
        } else {
          newIds = [...value, businessServiceToToolbarChip(optionValue)];
        }

        onApplyFilter(newIds);
      }}
      isFetching={isFetchingBusinessServices}
      fetchError={fetchErrorBusinessServices}
      hasInlineFilter
      onClear={() => onApplyFilter([])}
      onFilter={handleOnFilter}
    />
  );
};
