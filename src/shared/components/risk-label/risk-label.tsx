import React from "react";

import { Label } from "@patternfly/react-core";

import { DEFAULT_RISK_LABELS } from "Constants";
import { Risk } from "api/models";

type Color = "blue" | "cyan" | "green" | "orange" | "purple" | "red" | "grey";

type LabelListType = {
  [key in Risk]: {
    label: string;
    color: Color;
  };
};
const riskList: LabelListType = {
  GREEN: {
    label: DEFAULT_RISK_LABELS.get("GREEN")?.label || "",
    color: "green",
  },
  AMBER: {
    label: DEFAULT_RISK_LABELS.get("AMBER")?.label || "",
    color: "orange",
  },
  RED: {
    label: DEFAULT_RISK_LABELS.get("RED")?.label || "",
    color: "red",
  },
  UNKNOWN: {
    label: DEFAULT_RISK_LABELS.get("UNKNOWN")?.label || "",
    color: "grey",
  },
};

export interface IRiskLabelProps {
  risk: Risk;
}

export const RiskLabel: React.FunctionComponent<IRiskLabelProps> = ({
  risk,
}: IRiskLabelProps) => {
  const data = riskList[risk];

  return (
    <Label color={data ? data.color : "grey"}>{data ? data.label : risk}</Label>
  );
};
