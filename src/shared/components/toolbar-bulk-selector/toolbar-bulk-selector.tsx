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

import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  DropdownToggleCheckbox,
} from "@patternfly/react-core";

export interface IToolbarBulkSelectorProps {
  pageSize: number;
  totalItems: number;
  totalSelectedRows: number;
  areAllRowsSelected: boolean;
  onSelectNone: () => void;
  onSelectCurrentPage: () => void;
  onSelectAll: () => void;

  isFetching: boolean;
  fetchError?: any;
}

export const ToolbarBulkSelector: React.FC<IToolbarBulkSelectorProps> = ({
  pageSize,
  totalItems,
  areAllRowsSelected,
  totalSelectedRows,
  onSelectNone,
  onSelectCurrentPage,
  onSelectAll,

  isFetching,
  fetchError,
}) => {
  // i18
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const onDropDownSelect = () => {
    setIsOpen((current) => !current);
  };

  const onDropDownToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  if (fetchError) {
    return (
      <Dropdown
        toggle={<DropdownToggle isDisabled>Error</DropdownToggle>}
        isOpen={false}
        dropdownItems={[]}
      />
    );
  }

  return (
    <Dropdown
      isOpen={isOpen}
      position={DropdownPosition.left}
      onSelect={onDropDownSelect}
      dropdownItems={[
        <DropdownItem key="item-1" onClick={onSelectNone}>
          {t("actions.selectNone")} (0 items)
        </DropdownItem>,
        <DropdownItem key="item-2" onClick={onSelectCurrentPage}>
          {t("actions.selectPage")} ({pageSize} items)
        </DropdownItem>,
        <DropdownItem key="item-3" onClick={onSelectAll}>
          {t("actions.selectAll")} ({totalItems} items)
        </DropdownItem>,
      ]}
      toggle={
        <DropdownToggle
          onToggle={onDropDownToggle}
          isDisabled={isFetching}
          splitButtonItems={[
            <DropdownToggleCheckbox
              id="toolbar-bulk-select"
              key="toolbar-bulk-select"
              aria-label="Select"
              isDisabled={isFetching}
              isChecked={
                areAllRowsSelected
                  ? true
                  : totalSelectedRows === 0
                  ? false
                  : null
              }
              onClick={() => {
                totalSelectedRows > 0 ? onSelectNone() : onSelectAll();
              }}
            ></DropdownToggleCheckbox>,
          ]}
        >
          {totalSelectedRows !== 0 && (
            <>
              {totalSelectedRows} {t("terms.selected").toLowerCase()}
            </>
          )}
        </DropdownToggle>
      }
    />
  );
};
