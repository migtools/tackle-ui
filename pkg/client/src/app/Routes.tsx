import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { AppPlaceholder } from "@app/shared/components";
import { Paths } from "./Paths";

const ApplicationInventory = lazy(
  () => import("./pages/application-inventory")
);
const Reports = lazy(() => import("./pages/reports"));
const Controls = lazy(() => import("./pages/controls"));
const Identities = lazy(() => import("./pages/identities"));
const Repositories = lazy(() => import("./pages/repositories"));
const Proxies = lazy(() => import("./pages/proxies"));

export const AppRoutes = () => {
  const routes = [
    {
      component: ApplicationInventory,
      path: Paths.applicationInventory,
      exact: false,
    },
    { component: Reports, path: Paths.reports, exact: false },
    { component: Controls, path: Paths.controls, exact: false },

    { component: Identities, path: Paths.identities, exact: false },
    { component: Repositories, path: Paths.repositories, exact: false },
    { component: Proxies, path: Paths.proxies, exact: false },
  ];

  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        {routes.map(({ path, component, ...rest }, index) => (
          <Route key={index} path={path} component={component} {...rest} />
        ))}
        <Redirect from={Paths.base} to={Paths.applicationInventory} exact />
      </Switch>
    </Suspense>
  );
};
