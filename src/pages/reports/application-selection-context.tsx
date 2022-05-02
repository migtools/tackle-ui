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
import { useSelectionState, ISelectionState } from "@konveyor/lib-ui";
import { Application } from "api/models";

interface IApplicationSelectionContext extends ISelectionState<Application> {
  allItems: Application[];
}

const defaultState: IApplicationSelectionContext = {
  allItems: [],

  areAllSelected: false,
  selectedItems: [],
  isItemSelected: () => false,
  selectAll: () => {},
  selectMultiple: () => {},
  setSelectedItems: () => {},
  toggleItemSelected: () => {},
};

export const ApplicationSelectionContext = React.createContext<IApplicationSelectionContext>(
  defaultState
);

// Component

export interface IApplicationSelectionContextProviderProps {
  applications: Application[];
}

export const ApplicationSelectionContextProvider: React.FC<IApplicationSelectionContextProviderProps> = ({
  applications,
  children,
}) => {
  const [allItems] = useState(applications);
  const selectionState = useSelectionState<Application>({
    items: applications,
    initialSelected: applications,
    isEqual: (a, b) => a.id === b.id,
  });

  return (
    <ApplicationSelectionContext.Provider
      value={{ allItems, ...selectionState }}
    >
      {children}
    </ApplicationSelectionContext.Provider>
  );
};
