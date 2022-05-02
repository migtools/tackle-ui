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
import { AxiosError } from "axios";

interface IFormContext {
  isNorthBeingSaved: boolean;
  setIsNorthBeingSaved: (value: boolean) => void;

  northSaveError?: AxiosError;
  setNorthSaveError: (value?: AxiosError) => void;

  isSouthBeingSaved: boolean;
  setIsSouthBeingSaved: (value: boolean) => void;

  southSaveError?: AxiosError;
  setSouthSaveError: (value?: AxiosError) => void;
}

const defaultState: IFormContext = {
  isNorthBeingSaved: false,
  setIsNorthBeingSaved: () => {},

  northSaveError: undefined,
  setNorthSaveError: () => {},

  isSouthBeingSaved: false,
  setIsSouthBeingSaved: () => {},

  southSaveError: undefined,
  setSouthSaveError: () => {},
};

export const FormContext = React.createContext<IFormContext>(defaultState);

export const FormContextProvider: React.FC = ({ children }) => {
  const [isNorthBeingSaved, setIsNorthBeingSaved] = useState(false);
  const [isSouthBeingSaved, setIsSouthBeingSaved] = useState(false);

  const [northSaveError, setNorthSaveError] = useState<AxiosError>();
  const [southSaveError, setSouthSaveError] = useState<AxiosError>();

  return (
    <FormContext.Provider
      value={{
        isNorthBeingSaved,
        setIsNorthBeingSaved,

        isSouthBeingSaved,
        setIsSouthBeingSaved,

        northSaveError,
        setNorthSaveError,

        southSaveError,
        setSouthSaveError,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
