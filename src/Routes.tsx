/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { AppPlaceholder } from "shared/components";
import { Paths } from "./Paths";

const ApplicationInventory = lazy(
  () => import("./pages/application-inventory")
);
const Reports = lazy(() => import("./pages/reports"));
const Controls = lazy(() => import("./pages/controls"));

export const AppRoutes = () => {
  const routes = [
    {
      component: ApplicationInventory,
      path: Paths.applicationInventory,
      exact: false,
    },
    { component: Reports, path: Paths.reports, exact: false },
    { component: Controls, path: Paths.controls, exact: false },
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
