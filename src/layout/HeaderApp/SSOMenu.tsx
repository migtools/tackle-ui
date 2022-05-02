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
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useKeycloak } from "@react-keycloak/web";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownToggle,
  PageHeaderToolsItem,
} from "@patternfly/react-core";

export const SSOMenu: React.FC = () => {
  const { t } = useTranslation();

  const { keycloak } = useKeycloak();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onDropdownSelect = () => {
    setIsDropdownOpen((current) => !current);
  };

  const onDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  return (
    <PageHeaderToolsItem
      visibility={{
        default: "hidden",
        md: "visible",
      }} /** this user dropdown is hidden on mobile sizes */
    >
      {keycloak && (
        <Dropdown
          isPlain
          position="right"
          onSelect={onDropdownSelect}
          isOpen={isDropdownOpen}
          toggle={
            <DropdownToggle onToggle={onDropdownToggle}>
              {(keycloak.idTokenParsed as any)["preferred_username"]}
            </DropdownToggle>
          }
          dropdownItems={[
            <DropdownGroup key="sso">
              <DropdownItem
                key="sso_user_management"
                component="button"
                onClick={() => keycloak.accountManagement()}
              >
                {t("actions.manageAccount")}
              </DropdownItem>
              <DropdownItem key="sso_logout" onClick={() => keycloak.logout()}>
                {t("actions.logout")}
              </DropdownItem>
            </DropdownGroup>,
          ]}
        />
      )}
    </PageHeaderToolsItem>
  );
};
