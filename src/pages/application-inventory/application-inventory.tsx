import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Paths } from "Paths";
import { AppPlaceholder } from "shared/components";

const ApplicationList = lazy(() => import("./application-list"));
const ApplicationAssessment = lazy(() => import("./application-assessment"));
const ApplicationReview = lazy(() => import("./application-review"));

export const ApplicationInventory: React.FC = () => {
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

        <Redirect
          from={Paths.applicationInventory}
          to={Paths.applicationInventory_applicationList}
          exact
        />
      </Switch>
    </Suspense>
  );
};
