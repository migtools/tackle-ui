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
import { QuestionnaireCategory, Question } from "api/models";

export const COMMENTS_KEY = "comments";
export const QUESTIONS_KEY = "questions";
export const SAVE_ACTION_KEY = "saveAction";

export enum SAVE_ACTION_VALUE {
  SAVE,
  SAVE_AND_REVIEW,
  SAVE_AS_DRAFT,
}

export interface IFormValues {
  stakeholders: number[];
  stakeholderGroups: number[];
  [COMMENTS_KEY]: {
    [key: string]: string; // <categoryId, commentValue>
  };
  [QUESTIONS_KEY]: {
    [key: string]: number | undefined; // <questionId, optionId>
  };
  [SAVE_ACTION_KEY]: SAVE_ACTION_VALUE;
}

export const getCommentFieldName = (
  category: QuestionnaireCategory,
  fullName: boolean
) => {
  const fieldName = `category-${category.id}`;
  return fullName ? `${COMMENTS_KEY}.${fieldName}` : fieldName;
};

export const getQuestionFieldName = (question: Question, fullName: boolean) => {
  const fieldName = `question-${question.id}`;
  return fullName ? `${QUESTIONS_KEY}.${fieldName}` : fieldName;
};
