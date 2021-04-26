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

import { QuestionnaireCategory } from "api/models";
import { MultiInputSelection } from "./multi-input-selection";

import { Question, QuestionHeader, QuestionBody } from "./question";
import { useFormikContext } from "formik";
import { getValidatedFromError } from "utils/utils";
import { getCategoryCommentField } from "../../assessment-utils";

export interface WizardQuestionnaireStepProps {
  category: QuestionnaireCategory;
}

export const WizardQuestionnaireStep: React.FC<WizardQuestionnaireStepProps> = ({
  category,
}) => {
  const formik = useFormikContext<any>();

  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h1">{category.title}</Text>
        </TextContent>
      </StackItem>
      {category.questions
        .sort((a, b) => a.order - b.order)
        .map((question) => (
          <StackItem key={question.id}>
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
                <MultiInputSelection category={category} question={question} />
              </QuestionBody>
            </Question>
          </StackItem>
        ))}
      <StackItem>
        <Question>
          <QuestionHeader>Additional notes or comments</QuestionHeader>
          <QuestionBody>
            <TextArea
              rows={4}
              type="text"
              name={getCategoryCommentField(category)}
              aria-label="comments"
              aria-describedby="comments"
              isRequired={false}
              onChange={(_, event) => formik.handleChange(event)}
              onBlur={formik.handleBlur}
              value={formik.values[getCategoryCommentField(category)]}
              validated={getValidatedFromError(
                formik.errors[getCategoryCommentField(category)]
              )}
            />
          </QuestionBody>
        </Question>
      </StackItem>
    </Stack>
  );
};
