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
  onSelectAll?: () => void;
}

export const ToolbarBulkSelector: React.FC<IToolbarBulkSelectorProps> = ({
  pageSize,
  totalItems,
  areAllRowsSelected,
  totalSelectedRows,
  onSelectNone,
  onSelectCurrentPage,
  onSelectAll,
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

  // Dropdowns
  const dropdowns = [
    <DropdownItem key="item-1" onClick={onSelectNone}>
      {t("actions.selectNone")} (0 items)
    </DropdownItem>,
    <DropdownItem key="item-2" onClick={onSelectCurrentPage}>
      {t("actions.selectPage")} ({pageSize} items)
    </DropdownItem>,
  ];
  if (onSelectAll) {
    dropdowns.push(
      <DropdownItem key="item-3" onClick={onSelectAll}>
        {t("actions.selectAll")} ({totalItems} items)
      </DropdownItem>
    );
  }

  return (
    <Dropdown
      isOpen={isOpen}
      position={DropdownPosition.left}
      onSelect={onDropDownSelect}
      dropdownItems={dropdowns}
      toggle={
        <DropdownToggle
          onToggle={onDropDownToggle}
          splitButtonItems={[
            <DropdownToggleCheckbox
              id="toolbar-bulk-select"
              key="toolbar-bulk-select"
              aria-label="Select"
              isChecked={
                areAllRowsSelected
                  ? true
                  : totalSelectedRows === 0
                  ? false
                  : null
              }
              onClick={() => {
                if (onSelectAll) {
                  totalSelectedRows > 0 ? onSelectNone() : onSelectAll();
                } else {
                  totalSelectedRows > 0
                    ? onSelectNone()
                    : onSelectCurrentPage();
                }
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
