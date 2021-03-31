import React from "react";

import {
  Stack,
  StackItem,
  Text,
  TextArea,
  TextContent,
} from "@patternfly/react-core";

import { QuestionnaireSection } from "api/models";
import { RadioButtonQuestion } from "./radio-button-question";

export interface WizardQuestionnaireStepProps {
  section: QuestionnaireSection;
}

export const WizardQuestionnaireStep: React.FC<WizardQuestionnaireStepProps> = ({
  section,
}) => {
  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h1">{section.title}</Text>
        </TextContent>
      </StackItem>
      {section.questions.map((question) => (
        <StackItem>
          <RadioButtonQuestion question={question} />
        </StackItem>
      ))}
      <StackItem>
        <Stack>
          <StackItem>Additional notes or comments</StackItem>
          <StackItem>
            <TextArea />
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );
};
