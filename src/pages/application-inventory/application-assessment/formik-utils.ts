import { QuestionnaireCategory, Question } from "api/models";

export const getCommentFieldName = (category: QuestionnaireCategory) => {
  return `category-${category.id}`;
};

export const getQuestionFieldName = (question: Question) => {
  return `question-${question.id}`;
};
