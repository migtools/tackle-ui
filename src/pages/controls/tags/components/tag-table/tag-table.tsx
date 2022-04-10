import React from "react";
import { useTranslation } from "react-i18next";

import {
  cellWidth,
  IActions,
  ICell,
  IRow,
  IRowData,
  Table,
  TableBody,
  TableHeader,
} from "@patternfly/react-table";

import { useKcPermission } from "shared/hooks";
import { Tag, TagType } from "api/models";
import styles from "./tag-table.module.scss";

const ENTITY_FIELD = "entity";

const getRow = (rowData: IRowData): Tag => {
  return rowData[ENTITY_FIELD];
};

export interface TabTableProps {
  tagType: TagType;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

export const TagTable: React.FC<TabTableProps> = ({
  tagType,
  onEdit,
  onDelete,
}) => {
  // i18
  const { t } = useTranslation();

  // RBAC
  const { isAllowed: isAllowedToWrite } = useKcPermission({
    permissionsAllowed: ["controls:write"],
  });

  // Table's rows and columns
  const columns: ICell[] = [
    {
      title: t("terms.tagName"),
      transforms: [cellWidth(100)],
      cellFormatters: [],
      props: {
        className: styles.columnPadding,
      },
    },
  ];

  const rows: IRow[] = [];
  (tagType.tags || [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((item) => {
      rows.push({
        [ENTITY_FIELD]: item,
        noPadding: true,
        cells: [
          {
            title: item.name,
          },
        ],
      });
    });

  // Rows

  const editRow = (row: Tag) => {
    onEdit(row);
  };

  const deleteRow = (row: Tag) => {
    onDelete(row);
  };

  const actions: IActions = [
    {
      title: t("actions.edit"),
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData
      ) => {
        const row: Tag = getRow(rowData);
        editRow(row);
      },
    },
    {
      title: t("actions.delete"),
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData
      ) => {
        const row: Tag = getRow(rowData);
        deleteRow(row);
      },
    },
  ];

  return (
    <Table
      borders={false}
      variant="compact"
      aria-label="tag-table"
      cells={columns}
      rows={rows}
      actions={isAllowedToWrite ? actions : []}
      className={styles.actionColumnPadding}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};
