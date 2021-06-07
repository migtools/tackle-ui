import React, { useState } from "react";
import { Application } from "api/models";

interface IApplicationSelectionContext {
  applications: Application[];
  setApplications: (applications: Application[]) => void;
}

const defaultState: IApplicationSelectionContext = {
  applications: [],
  setApplications: () => {},
};

export const ApplicationSelectionContext = React.createContext<IApplicationSelectionContext>(
  defaultState
);

export const ApplicationSelectionContextProvider: React.FC = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  return (
    <ApplicationSelectionContext.Provider
      value={{
        applications,
        setApplications,
      }}
    >
      {children}
    </ApplicationSelectionContext.Provider>
  );
};
