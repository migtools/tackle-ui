import React from "react";
import { useFormikContext } from "formik";
import { Radio, Stack, StackItem } from "@patternfly/react-core";

import { Question, QuestionnaireCategory } from "api/models";
import { getCategoryQuestionField } from "../../../assessment-utils";

export interface MultiInputSelectionProps {
  category: QuestionnaireCategory;
  question: Question;
}

export const MultiInputSelection: React.FC<MultiInputSelectionProps> = ({
  category,
  question,
}) => {
  const formik = useFormikContext<any>();
  const questionField = getCategoryQuestionField(category, question);

  return (
    <Stack>
      {(question.options || [])
        .sort((a, b) => a.order - b.order)
        .map((option, i) => (
          <StackItem className="pf-u-pb-xs" key={option.id}>
            <Radio
              id={`${option.id}`}
              name={`option-${i}`}
              isChecked={formik.values[questionField] === option.id}
              onChange={() => {
                formik.setFieldValue(questionField, option.id);
              }}
              label={option.option}
              value={option.id}
            />
          </StackItem>
        ))}
    </Stack>
  );
};
