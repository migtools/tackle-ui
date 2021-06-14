import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  DropdownToggleCheckbox,
} from "@patternfly/react-core";

export interface IToolbarBulkSelectorProps {
  perPage: number;
  totalItems: number;
  totalSelectedRows: number;
  areAllRowsSelected: boolean;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onSelectCurrentPage: () => void;
}

export const ToolbarBulkSelector: React.FC<IToolbarBulkSelectorProps> = ({
  perPage,
  totalItems,
  areAllRowsSelected,
  totalSelectedRows,
  onSelectAll,
  onSelectNone,
  onSelectCurrentPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onDropDownSelect = () => {
    setIsOpen((current) => !current);
  };

  const onDropDownToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      position={DropdownPosition.left}
      onSelect={onDropDownSelect}
      dropdownItems={[
        <DropdownItem key="item-1" onClick={onSelectNone}>
          Select none (0 items)
        </DropdownItem>,
        <DropdownItem key="item-2" onClick={onSelectCurrentPage}>
          Select page ({perPage} items)
        </DropdownItem>,
        <DropdownItem key="item-3" onClick={onSelectAll}>
          Select all ({totalItems} items)
        </DropdownItem>,
      ]}
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
                totalSelectedRows > 0 ? onSelectNone() : onSelectAll();
              }}
            ></DropdownToggleCheckbox>,
          ]}
        >
          {totalSelectedRows !== 0 && <>{totalSelectedRows} selected</>}
        </DropdownToggle>
      }
    />
  );
};
