import React from "react";
import { NoDataEmptyState } from "../no-data-empty-state";

export const StateNoData: React.FC = () => {
  return (
    <NoDataEmptyState
      title="No data available"
      description="No data available to be shown here."
    />
  );
};
