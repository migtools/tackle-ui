import React from "react";
import { KcPermission } from "Constants";
import { useKcPermission } from "shared/hooks";

export interface VisibilityByPermissionProps {
  permissionsAllowed: KcPermission[];
}

export const VisibilityByPermission: React.FC<VisibilityByPermissionProps> = ({
  permissionsAllowed,
  children,
}) => {
  const { isAllowed } = useKcPermission({ permissionsAllowed });
  return <>{isAllowed && children}</>;
};
