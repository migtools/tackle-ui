import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Paths } from "Paths";
import { AppPlaceholder } from "shared/components";

const ApplicationList = lazy(() => import("./application-list"));

export const ApplicationInventory: React.FC = () => {
  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        <Route
          path={Paths.applicationInventory_applicationList}
          component={ApplicationList}
        />
        <Redirect
          from={Paths.applicationInventory}
          to={Paths.applicationInventory_applicationList}
          exact
        />
      </Switch>
    </Suspense>
  );
};
