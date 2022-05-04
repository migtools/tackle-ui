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
import { Redirect, Route, Switch } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";

import { Paths } from "Paths";
import { AppPlaceholder } from "shared/components";

import { EditCompanyHeader } from "./controls-header";

const Stakeholders = lazy(() => import("./stakeholders"));
const StakeholderGroups = lazy(() => import("./stakeholder-groups"));
const JobFunctions = lazy(() => import("./job-functions"));
const businessServices = lazy(() => import("./business-services"));
const Tags = lazy(() => import("./tags"));

export const Controls: React.FC = () => {
  return (
    <>
      <EditCompanyHeader />
      <PageSection>
        <Suspense fallback={<AppPlaceholder />}>
          <Switch>
            <Route
              path={Paths.controls_stakeholders}
              component={Stakeholders}
            />
            <Route
              path={Paths.controls_stakeholderGroups}
              component={StakeholderGroups}
            />
            <Route
              path={Paths.controls_jobFunctions}
              component={JobFunctions}
            />
            <Route
              path={Paths.controls_businessServices}
              component={businessServices}
            />
            <Route path={Paths.controls_tags} component={Tags} />
            <Redirect
              from={Paths.controls}
              to={Paths.controls_stakeholders}
              exact
            />
          </Switch>
        </Suspense>
      </PageSection>
    </>
  );
};
