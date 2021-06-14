import React from "react";
import { Label } from "@patternfly/react-core";

import { PROPOSED_ACTION_LIST } from "Constants";
import { ProposedAction } from "api/models";

export interface IProposedActionLabelProps {
  action: ProposedAction;
}

export const ProposedActionLabel: React.FunctionComponent<IProposedActionLabelProps> = ({
  action,
}: IProposedActionLabelProps) => {
  const data = PROPOSED_ACTION_LIST[action];

  return (
    <Label color={data ? data.labelColor : "grey"}>
      {data ? data.label : action}
    </Label>
  );
};
