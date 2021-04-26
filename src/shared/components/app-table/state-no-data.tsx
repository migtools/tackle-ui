import React from "react";
import { NoDataEmptyState } from "../no-data-empty-state";

export const StateNoData: React.FC = () => {
  return (
    <NoDataEmptyState
      title="No data available"
      description="Create a new resource to search using this table."
    />
  );
};
