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
  const { t } = useTranslation();

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
      actions={actions}
      className={styles.actionColumnPadding}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};
