import React from "react";
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

export interface NoDataEmptyStateProps {
  title: string;
  description: string;
}

export const NoDataEmptyState: React.FC<NoDataEmptyStateProps> = ({
  title,
  description,
}) => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      <EmptyStateBody>{description}</EmptyStateBody>
    </EmptyState>
  );
};
