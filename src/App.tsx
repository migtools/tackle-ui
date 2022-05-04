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
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./Routes";
import "./App.scss";

import { DefaultLayout } from "./layout";

import NotificationsPortal from "@redhat-cloud-services/frontend-components-notifications/NotificationPortal";
import "@redhat-cloud-services/frontend-components-notifications/index.css";

import { ConfirmDialogContainer } from "./shared/containers/confirm-dialog-container";
import { BulkCopyNotificationsContainer } from "./shared/containers/bulk-copy-notifications-container";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
      <NotificationsPortal />
      <ConfirmDialogContainer />
      <BulkCopyNotificationsContainer />
    </BrowserRouter>
  );
};

export default App;
