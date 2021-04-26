import React from "react";

import {
  Popover,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextArea,
  TextContent,
} from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

import { QuestionnaireSection } from "api/models";
import { MultiInputSelection } from "./multi-input-selection";

import { Question, QuestionHeader, QuestionBody } from "./question";

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
          <Question>
            <QuestionHeader>
              <Split hasGutter>
                <SplitItem>{question.question}</SplitItem>
                <SplitItem>
                  <Popover bodyContent={<div>{question.description}</div>}>
                    <button
                      type="button"
                      aria-label="More info"
                      onClick={(e) => e.preventDefault()}
                      className="pf-c-form__group-label-help"
                    >
                      <HelpIcon />
                    </button>
                  </Popover>
                </SplitItem>
              </Split>
            </QuestionHeader>
            <QuestionBody>
              {question.options && (
                <MultiInputSelection options={question.options} />
              )}
            </QuestionBody>
          </Question>
        </StackItem>
      ))}
      <StackItem>
        <Question>
          <QuestionHeader>Additional notes or comments</QuestionHeader>
          <QuestionBody>
            <TextArea rows={4} />
          </QuestionBody>
        </Question>
      </StackItem>
    </Stack>
  );
};
