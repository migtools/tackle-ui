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
import { Label } from "@patternfly/react-core";

import { PROPOSED_ACTION_LIST } from "Constants";
import { ProposedAction } from "api/models";

export interface IProposedActionLabelProps {
  action: ProposedAction;
}

export const ProposedActionLabel: React.FunctionComponent<IProposedActionLabelProps> = ({
  action,
}: IProposedActionLabelProps) => {
  const { t } = useTranslation();

  const data = PROPOSED_ACTION_LIST[action];

  return (
    <Label color={data ? data.labelColor : "grey"}>
      {data ? t(data.i18Key) : action}
    </Label>
  );
};
