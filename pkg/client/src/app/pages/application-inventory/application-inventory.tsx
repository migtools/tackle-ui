import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { Paths } from "app/Paths";
import { AppPlaceholder } from "app/shared/components";

const ApplicationList = lazy(() => import("./application-list"));
const ApplicationAssessment = lazy(() => import("./application-assessment"));
const ApplicationReview = lazy(() => import("./application-review"));
const ManageImports = lazy(() => import("./manage-imports"));
const ImportDetails = lazy(() => import("./manage-imports-details"));

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
          exact
        />
        <Route
          path={Paths.applicationInventory_manageImports_details}
          component={ImportDetails}
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
