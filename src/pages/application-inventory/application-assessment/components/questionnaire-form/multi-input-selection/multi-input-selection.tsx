import React, { useMemo } from "react";
import { Field } from "formik";
import { Radio, Stack, StackItem } from "@patternfly/react-core";

import { Question } from "api/models";
import { getQuestionFieldName } from "../../../formik-utils";

export interface MultiInputSelectionProps {
  question: Question;
}

export const MultiInputSelection: React.FC<MultiInputSelectionProps> = ({
  question,
}) => {
  const sortedOptions = useMemo(() => {
    return (question.options || []).sort((a, b) => a.order - b.order);
  }, [question]);

  const questionFieldName = `questions.${getQuestionFieldName(question)}`;

  return (
    <Field name={questionFieldName}>
      {({ field, form }: any) => {
        return (
          <Stack>
            {sortedOptions.map((option, i) => (
              <StackItem key={option.id} className="pf-u-pb-xs">
                <Radio
                  id={`${option.id}`}
                  name={`question-${question.id}`} // Radio button group name
                  isChecked={field.value === option.id}
                  onChange={() => {
                    form.setFieldValue(questionFieldName, option.id);
                  }}
                  label={option.option}
                  value={option.id}
                />
              </StackItem>
            ))}
          </Stack>
        );
      }}
    </Field>
  );
};
