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
import { Question, QuestionnaireCategory } from "api/models";
import { getCommentFieldName, getQuestionFieldName } from "./form-utils";

describe("Application assessment - form utils", () => {
  const category: QuestionnaireCategory = {
    id: 123,
    order: 1,
    questions: [],
  };
  const question: Question = {
    id: 321,
    order: 1,
    options: [],
    description: "",
    question: "",
  };

  it("getCommentFieldName: fullName", () => {
    const fieldName = getCommentFieldName(category, true);
    expect(fieldName).toBe("comments.category-123");
  });

  it("getCommentFieldName: singleName", () => {
    const fieldName = getCommentFieldName(category, false);
    expect(fieldName).toBe("category-123");
  });

  it("getQuestionFieldName: fullName", () => {
    const fieldName = getQuestionFieldName(question, true);
    expect(fieldName).toBe("questions.question-321");
  });

  it("getQuestionFieldName: singleName", () => {
    const fieldName = getQuestionFieldName(question, false);
    expect(fieldName).toBe("question-321");
  });
});
