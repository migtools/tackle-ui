import React, { Suspense } from "react";
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
    <Suspense fallback={<AppPlaceholder />}>
      <Page
        header={<HeaderApp />}
        sidebar={<SidebarApp />}
        isManagedSidebar
        skipToContent={PageSkipToContent}
        mainContainerId={pageId}
      >
        {children}
      </Page>
    </Suspense>
  );
};
