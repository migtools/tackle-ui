import React from "react";

export interface QuestionBodyProps {
  children: React.ReactNode;
}

export const QuestionBody: React.FC<QuestionBodyProps> = ({ children }) => {
  return <div className="pf-u-m-xs pf-u-ml-md">{children}</div>;
};
