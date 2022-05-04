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
import { useState } from "react";

export interface ISelectionStateArgs<T> {
  pageItems: T[];
  totalItems: number;
  initialSelected?: T[];
  isEqual?: (a: T, b: T) => boolean;
  externalState?: [T[], React.Dispatch<React.SetStateAction<T[]>>];
}

export interface ISelectionState<T> {
  selectedItems: T[];
  isItemSelected: (item: T) => boolean;
  toggleItemSelected: (item: T, isSelecting?: boolean) => void;
  selectMultiple: (items: T[], isSelecting: boolean) => void;
  areAllSelected: boolean;
  selectAllPage: (isSelecting?: boolean) => void;
  setSelectedItems: (items: T[]) => void;
}

export const useSelectionFromPageState = <T>({
  pageItems,
  totalItems,
  initialSelected = [],
  isEqual = (a, b) => a === b,
  externalState,
}: ISelectionStateArgs<T>): ISelectionState<T> => {
  const internalState = useState<T[]>(initialSelected);
  const [selectedItems, setSelectedItems] = externalState || internalState;

  const isItemSelected = (item: T) =>
    selectedItems.some((i) => isEqual(item, i));

  const toggleItemSelected = (item: T, isSelecting = !isItemSelected(item)) => {
    if (isSelecting) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((i) => !isEqual(i, item)));
    }
  };

  const selectMultiple = (items: T[], isSelecting: boolean) => {
    const otherSelectedItems = selectedItems.filter(
      (selected) => !items.some((item) => isEqual(selected, item))
    );
    if (isSelecting) {
      setSelectedItems([...otherSelectedItems, ...items]);
    } else {
      setSelectedItems(otherSelectedItems);
    }
  };

  const selectAllPage = (isSelecting = true) =>
    selectMultiple(pageItems, isSelecting);
  const areAllSelected = selectedItems.length === totalItems;

  return {
    selectedItems,
    isItemSelected,
    toggleItemSelected,
    selectMultiple,
    areAllSelected,
    selectAllPage,
    setSelectedItems,
  };
};
