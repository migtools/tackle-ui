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
  description?: string;
  breadcrumbs: { title: string; path: string }[];
  menuActions: { label: string; callback: () => void }[];
  navItems?: { title: string; path: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
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
              {description && <Text component="small">{description}</Text>}
            </TextContent>
          </SplitItem>
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
