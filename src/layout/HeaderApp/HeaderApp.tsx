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
  PageHeader,
  Brand,
  PageHeaderTools,
  Avatar,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

import { AppAboutModalState } from "../AppAboutModalState";
import { SSOMenu } from "./SSOMenu";
import { MobileDropdown } from "./MobileDropdown";

import navBrandImage from "images/tackle.png";
import imgAvatar from "images/avatar.svg";

export const HeaderApp: React.FC = () => {
  const toolbar = (
    <PageHeaderTools>
      <PageHeaderToolsGroup
        visibility={{
          default: "hidden",
          "2xl": "visible",
          xl: "visible",
          lg: "visible",
          md: "hidden",
          sm: "hidden",
        }}
      >
        <PageHeaderToolsItem>
          <AppAboutModalState>
            {({ toggleModal }) => {
              return (
                <Button
                  id="aboutButton"
                  aria-label="about-button"
                  variant={ButtonVariant.plain}
                  onClick={toggleModal}
                >
                  <HelpIcon />
                </Button>
              );
            }}
          </AppAboutModalState>
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem
          visibility={{
            lg: "hidden",
          }} /** this kebab dropdown replaces the icon buttons and is hidden for desktop sizes */
        >
          <MobileDropdown />
        </PageHeaderToolsItem>
        <SSOMenu />
      </PageHeaderToolsGroup>
      <Avatar src={imgAvatar} alt="Avatar image" />
    </PageHeaderTools>
  );

  return (
    <PageHeader
      logo={<Brand src={navBrandImage} alt="brand" />}
      headerTools={toolbar}
      showNavToggle
    />
  );
};
