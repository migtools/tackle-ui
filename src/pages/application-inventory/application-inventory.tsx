import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { Paths } from "Paths";
import { AppPlaceholder } from "shared/components";

const ApplicationList = lazy(() => import("./application-list"));
const ApplicationAssessment = lazy(() => import("./application-assessment"));
const ApplicationReview = lazy(() => import("./application-review"));
const ManageImports = lazy(() => import("./manage-imports"));

export const ApplicationInventory: React.FC = () => {
  const { search } = useLocation();

  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        <Route
          path={Paths.applicationInventory_applicationList}
          component={ApplicationList}
        />
        <Route
          path={Paths.applicationInventory_assessment}
          component={ApplicationAssessment}
        />
        <Route
          path={Paths.applicationInventory_review}
          component={ApplicationReview}
        />
        <Route
          path={Paths.applicationInventory_manageImports}
          component={ManageImports}
        />

        <Redirect
          from={Paths.applicationInventory}
          to={Paths.applicationInventory_applicationList + search}
          exact
        />
      </Switch>
    </Suspense>
  );
};
