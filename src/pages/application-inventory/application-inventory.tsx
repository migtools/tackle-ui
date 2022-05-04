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
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { Paths } from "Paths";
import { AppPlaceholder } from "shared/components";

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
