import React, { lazy, Suspense } from "react";
import { Redirect, Switch, useLocation } from "react-router-dom";

import { Paths } from "Paths";
import { AppPlaceholder } from "shared/components";
import { ProtectedRoute } from "ProtectedRoute";

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
        <ProtectedRoute
          path={Paths.applicationInventory_applicationList}
          component={ApplicationList}
          permissionsAllowed={["inventory:application:read"]}
        />
        <ProtectedRoute
          path={Paths.applicationInventory_assessment}
          component={ApplicationAssessment}
          permissionsAllowed={["pathfinder:assessment:write"]}
        />
        <ProtectedRoute
          path={Paths.applicationInventory_review}
          component={ApplicationReview}
          permissionsAllowed={["inventory:application-review:write"]}
        />
        <ProtectedRoute
          path={Paths.applicationInventory_manageImports}
          component={ManageImports}
          exact
          permissionsAllowed={["inventory:application-import:read"]}
        />
        <ProtectedRoute
          path={Paths.applicationInventory_manageImports_details}
          component={ImportDetails}
          permissionsAllowed={["inventory:application-import:read"]}
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
