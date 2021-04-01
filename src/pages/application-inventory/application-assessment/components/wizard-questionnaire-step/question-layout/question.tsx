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

export const QuestionLayout: React.FC<RadioButtonQuestionProps> = ({
  question,
}) => {
  return (
    <div>
      <StackItem>{question.question}</StackItem>
      <StackItem></StackItem>
    </div>
  );
};
