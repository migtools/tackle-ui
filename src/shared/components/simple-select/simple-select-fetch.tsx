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
import { AxiosError } from "axios";

import { WarningTriangleIcon } from "@patternfly/react-icons";

import { getAxiosErrorMessage } from "utils/utils";
import { ISimpleSelectProps, SimpleSelect } from "./simple-select";

export interface ISimpleSelectFetchProps
  extends Omit<ISimpleSelectProps, "toggleIcon" | "customContent"> {
  isFetching: boolean;
  fetchError?: AxiosError;
}

export const SimpleSelectFetch: React.FC<ISimpleSelectFetchProps> = ({
  isFetching,
  fetchError,
  ...props
}) => {
  let customContent;
  if (isFetching) {
    customContent = <div>&nbsp;Loading...</div>;
  } else if (fetchError) {
    customContent = <div>&nbsp;{getAxiosErrorMessage(fetchError)}</div>;
  }

  return (
    <SimpleSelect
      toggleIcon={fetchError && <WarningTriangleIcon />}
      customContent={customContent}
      {...props}
    />
  );
};
