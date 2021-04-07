import React from "react";
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

export const StateNoData: React.FC = () => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h2" size="lg">
        No data available
      </Title>
      <EmptyStateBody>
        Create a new resource to search using this table.
      </EmptyStateBody>
    </EmptyState>
  );
};
