import React from "react";
import { Label } from "@patternfly/react-core";
import { DEFAULT_PROPOSED_ACTIONS, ProposedAction } from "Constants";

type Color = "blue" | "cyan" | "green" | "orange" | "purple" | "red" | "grey";

type ProposedActionListType = {
  [key in ProposedAction]: {
    label: string;
    color: Color;
  };
};
const actionsList: ProposedActionListType = {
  rehost: {
    label: DEFAULT_PROPOSED_ACTIONS.get(ProposedAction.REHOST) || "",
    color: "green",
  },
  replatform: {
    label: DEFAULT_PROPOSED_ACTIONS.get(ProposedAction.REPLATFORM) || "",
    color: "orange",
  },
  refactor: {
    label: DEFAULT_PROPOSED_ACTIONS.get(ProposedAction.REFACTOR) || "",
    color: "red",
  },
  repurchase: {
    label: DEFAULT_PROPOSED_ACTIONS.get(ProposedAction.REPURCHASE) || "",
    color: "purple",
  },
  retire: {
    label: DEFAULT_PROPOSED_ACTIONS.get(ProposedAction.RETIRE) || "",
    color: "cyan",
  },
  retain: {
    label: DEFAULT_PROPOSED_ACTIONS.get(ProposedAction.RETAIN) || "",
    color: "blue",
  },
};

export interface IProposedActionLabelProps {
  action: ProposedAction;
}

export const ProposedActionLabel: React.FunctionComponent<IProposedActionLabelProps> = ({
  action,
}: IProposedActionLabelProps) => {
  const data = actionsList[action];

  return (
    <Label color={data ? data.color : "grey"}>
      {data ? data.label : action}
    </Label>
  );
};
