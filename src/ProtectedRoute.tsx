import React from "react";
import { Route, RouteProps } from "react-router-dom";

import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";

import { useKcPermission } from "shared/hooks";

import { KcPermission } from "Constants";

export interface IProtectedRouteProps extends RouteProps {
  permissionsAllowed: KcPermission[];
}

export const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  permissionsAllowed,
  ...rest
}) => {
  const { isAllowed } = useKcPermission({
    permissionsAllowed,
  });

  const notAuthorizedState = (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={WarningTriangleIcon} />
        <Title headingLevel="h2" size="lg">
          403 Forbidden
        </Title>
        <EmptyStateBody>You are not allowed to access this page</EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );

  if (!isAllowed) {
    return <Route render={() => notAuthorizedState}></Route>;
  }

  return <Route {...rest} />;
};
