import React from "react";

export interface QuestionHeaderProps {
  children: React.ReactNode;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({ children }) => {
  return <div className="pf-u-m-xs pf-u-ml-md">{children}</div>;
};
