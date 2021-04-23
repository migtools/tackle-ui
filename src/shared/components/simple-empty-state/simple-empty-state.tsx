import React from "react";
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";

export interface SimpleEmptyStateProps {
  icon?: any;
  title: string;
  description?: string;
}

export const SimpleEmptyState: React.FC<SimpleEmptyStateProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <EmptyState variant={EmptyStateVariant.small}>
      {icon && <EmptyStateIcon icon={icon} />}
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      {description && <EmptyStateBody>{description}</EmptyStateBody>}
    </EmptyState>
  );
};
