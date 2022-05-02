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
import {
  Stack,
  StackItem,
  Split,
  SplitItem,
  TextContent,
  Text,
} from "@patternfly/react-core";
import { BreadCrumbPath } from "../breadcrumb-path";
import { MenuActions } from "../menu-actions";
import { HorizontalNav } from "../horizontal-nav/horizontal-nav";

export interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  breadcrumbs: { title: string; path: string | (() => void) }[];
  btnActions?: React.ReactNode;
  menuActions: { label: string; callback: () => void }[];
  navItems?: { title: string; path: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  btnActions,
  menuActions,
  navItems,
}) => {
  return (
    <Stack hasGutter>
      <StackItem>
        {breadcrumbs.length > 0 && <BreadCrumbPath breadcrumbs={breadcrumbs} />}
      </StackItem>
      <StackItem>
        <Split>
          <SplitItem isFilled>
            <TextContent>
              <Text component="h1">{title}</Text>
              {description}
            </TextContent>
          </SplitItem>
          {btnActions && <SplitItem>{btnActions}</SplitItem>}
          {menuActions.length > 0 && (
            <SplitItem>
              <MenuActions actions={menuActions} />
            </SplitItem>
          )}
        </Split>
      </StackItem>
      {navItems && (
        <StackItem>
          <HorizontalNav navItems={navItems} />
        </StackItem>
      )}
    </Stack>
  );
};
