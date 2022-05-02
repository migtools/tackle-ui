/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { useMemo } from "react";
import { Field } from "formik";
import { Radio, Stack, StackItem } from "@patternfly/react-core";

import { Question } from "api/models";
import { getQuestionFieldName } from "../../../form-utils";

export interface MultiInputSelectionProps {
  question: Question;
}

export const MultiInputSelection: React.FC<MultiInputSelectionProps> = ({
  question,
}) => {
  const sortedOptions = useMemo(() => {
    return (question.options || []).sort((a, b) => a.order - b.order);
  }, [question]);

  const questionFieldName = getQuestionFieldName(question, true);

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
