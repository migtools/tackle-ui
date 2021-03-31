import React from "react";

import {
  Grid,
  Radio,
  Stack,
  StackItem,
  TextArea,
} from "@patternfly/react-core";

import { Question } from "api/models";

export interface RadioButtonQuestionProps {
  question: Question;
}

export const RadioButtonQuestion: React.FC<RadioButtonQuestionProps> = ({
  question,
}) => {
  return (
    <Stack className="pf-u-display-flex pf-u-align-items-flex-start pf-u-flex-wrap">
      <StackItem className="pf-u-mb-sm">{question.question}</StackItem>
      <StackItem>
        <Stack className="pf-u-display-flex pf-u-align-items-flex-start pf-u-flex-wrap">
          {question.options?.map((option) => (
            <StackItem className="pf-u-m-xs pf-u-ml-md">
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
      </StackItem>
    </Stack>
  );
};
