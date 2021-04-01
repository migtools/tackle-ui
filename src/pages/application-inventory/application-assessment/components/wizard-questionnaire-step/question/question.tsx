import React from "react";
import { Stack } from "@patternfly/react-core";

export interface RadioButtonQuestionProps {
  children?: React.ReactNode;
}

export const Question: React.FC<RadioButtonQuestionProps> = ({
  children = null,
}) => {
  return <Stack>{children}</Stack>;
};
