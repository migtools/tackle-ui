import React from "react";

import { Label } from "@patternfly/react-core";

import { RISK_LIST } from "Constants";
import { Risk } from "api/models";

export interface IRiskLabelProps {
  risk: Risk;
}

export const RiskLabel: React.FunctionComponent<IRiskLabelProps> = ({
  risk,
}: IRiskLabelProps) => {
  const data = RISK_LIST[risk];

  return (
    <Label color={data ? data.labelColor : "grey"}>
      {data ? data.label : risk}
    </Label>
  );
};
