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
import { Bullseye, Spinner, Skeleton } from "@patternfly/react-core";
import {
  Table,
  TableHeader,
  TableBody,
  IRow,
  TableProps,
} from "@patternfly/react-table";

import { StateNoData } from "./state-no-data";
import { StateNoResults } from "./state-no-results";
import { StateError } from "./state-error";

export interface IAppTableProps extends TableProps {
  isLoading: boolean;
  loadingVariant?: "skeleton" | "spinner" | "none";
  fetchError?: any;

  filtersApplied: boolean;
  noDataState?: any;
  noSearchResultsState?: any;
  errorState?: any;
}

export const AppTable: React.FC<IAppTableProps> = ({
  cells,
  rows,
  "aria-label": ariaLabel = "main-table",

  isLoading,
  fetchError,
  loadingVariant = "skeleton",

  filtersApplied,
  noDataState,
  noSearchResultsState,
  errorState,

  ...rest
}) => {
  if (isLoading && loadingVariant !== "none") {
    let rows: IRow[] = [];
    if (loadingVariant === "skeleton") {
      rows = [...Array(10)].map(() => {
        return {
          cells: [...Array(cells.length)].map(() => ({
            title: <Skeleton />,
          })),
        };
      });
    } else if (loadingVariant === "spinner") {
      rows = [
        {
          heightAuto: true,
          cells: [
            {
              props: { colSpan: 8 },
              title: (
                <Bullseye>
                  <Spinner size="xl" />
                </Bullseye>
              ),
            },
          ],
        },
      ];
    } else {
      throw new Error("Can not determine the loading state of table");
    }

    return (
      <Table aria-label={ariaLabel} cells={cells} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
    );
  }

  if (fetchError) {
    return (
      <>
        <Table aria-label={ariaLabel} cells={cells} rows={[]}>
          <TableHeader />
          <TableBody />
        </Table>
        {errorState ? errorState : <StateError />}
      </>
    );
  }

  if (rows.length === 0) {
    return filtersApplied ? (
      <>
        <Table aria-label={ariaLabel} cells={cells} rows={[]}>
          <TableHeader />
          <TableBody />
        </Table>
        {noSearchResultsState ? noSearchResultsState : <StateNoResults />}
      </>
    ) : (
      <>
        <Table aria-label={ariaLabel} cells={cells} rows={[]}>
          <TableHeader />
          <TableBody />
        </Table>
        {noDataState ? noDataState : <StateNoData />}
      </>
    );
  }

  return (
    <Table aria-label={ariaLabel} cells={cells} rows={rows} {...rest}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};
