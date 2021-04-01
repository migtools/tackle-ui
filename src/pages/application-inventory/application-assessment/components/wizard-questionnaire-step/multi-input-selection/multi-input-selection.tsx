import React from "react";
import { Radio, Stack, StackItem } from "@patternfly/react-core";

import { QuestionOption } from "api/models";

export interface MultiInputSelectionProps {
  options: QuestionOption[];
}

export const MultiInputSelection: React.FC<MultiInputSelectionProps> = ({
  options,
}) => {
  return (
    <Stack>
      {options.map((option) => (
        <StackItem className="pf-u-pb-xs">
          <Radio
            id={`${option.id}`}
            name={`${option.id}`}
            isChecked={false}
            onChange={() => {}}
            label={option.option}
            // value="check1"
          />
        </StackItem>
      ))}
    </Stack>
  );
};
