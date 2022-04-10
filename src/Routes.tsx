import { lazy, Suspense } from "react";
import { Switch, Redirect } from "react-router-dom";

import { AppPlaceholder } from "shared/components";
import { ProtectedRoute, IProtectedRouteProps } from "./ProtectedRoute";
import { Paths } from "./Paths";

const ApplicationInventory = lazy(
  () => import("./pages/application-inventory")
);
const Reports = lazy(() => import("./pages/reports"));
const Controls = lazy(() => import("./pages/controls"));

export const AppRoutes = () => {
  const routes: IProtectedRouteProps[] = [
    {
      component: ApplicationInventory,
      path: Paths.applicationInventory,
      exact: false,
      permissionsAllowed: ["inventory:application:read"],
    },
    {
      component: Reports,
      path: Paths.reports,
      exact: false,
      permissionsAllowed: ["inventory:application:read"],
    },
    {
      component: Controls,
      path: Paths.controls,
      exact: false,
      permissionsAllowed: ["controls:read"],
    },
  ];

  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        {routes.map(({ path, component, ...rest }, index) => (
          <ProtectedRoute
            key={index}
            path={path}
            component={component}
            {...rest}
          />
        ))}
        <Redirect from={Paths.base} to={Paths.applicationInventory} exact />
      </Switch>
    </Suspense>
  );
};
