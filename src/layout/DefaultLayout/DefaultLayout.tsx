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
import { Page, SkipToContent } from "@patternfly/react-core";
import { AppPlaceholder } from "shared/components";
import { HeaderApp } from "../HeaderApp";
import { SidebarApp } from "../SidebarApp";

export interface DefaultLayoutProps {}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const pageId = "main-content-page-layout-horizontal-nav";
  const PageSkipToContent = (
    <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>
  );

  return (
    <React.Suspense fallback={<AppPlaceholder />}>
      <Page
        header={<HeaderApp />}
        sidebar={<SidebarApp />}
        isManagedSidebar
        skipToContent={PageSkipToContent}
        mainContainerId={pageId}
      >
        {children}
      </Page>
    </React.Suspense>
  );
};
