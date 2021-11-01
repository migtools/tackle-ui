import { useKeycloak } from "@react-keycloak/web";
import { KcPermission, KC_API_CLIENT } from "Constants";

export interface IArgs {
  permissionsAllowed: KcPermission[];
}

export interface IState {
  isAllowed: boolean;
}

export const useKcPermission = ({ permissionsAllowed }: IArgs): IState => {
  const { keycloak } = useKeycloak();

  const isAllowed = permissionsAllowed.some((permission) => {
    return (
      keycloak.hasRealmRole(permission) ||
      keycloak.hasResourceRole(permission, KC_API_CLIENT)
    );
  });

  return {
    isAllowed,
  };
};

export default useKcPermission;
