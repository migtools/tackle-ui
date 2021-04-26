import { QuestionnaireCategory, Question } from "api/models";

export const getCategoryCommentField = (category: QuestionnaireCategory) => {
  return `category-${category.id}-comment`;
};

export const getCategoryQuestionField = (
  category: QuestionnaireCategory,
  question: Question
) => {
  return `question-${question.id}`;
};

export const a = (value: any) => {};
