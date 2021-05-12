import React from "react";

import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
  ToolbarToggleGroup,
} from "@patternfly/react-core";

import { FilterIcon } from "@patternfly/react-icons";

import { AppTable, IAppTableProps } from "../app-table/app-table";
import { SimplePagination } from "../simple-pagination";
import { IAppTableWithControlsProps } from "./app-table-with-controls";

export interface AppTableWithOfflineControlsProps
  extends IAppTableWithControlsProps {
  items?: any[];
  mapToIRow: (items: any[]) => IRow[];
  filterItem: (filterText: string, value: any) => boolean;
  compareItem: (a: any, b: any, columnIndex?: number) => number;
}

export const AppTableWithControls: React.FC<AppTableWithOfflineControlsProps> = ({
  ...rest
}) => {
  return <AppTableWithControls {...rest} />;
};
