import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Nav, NavItem, PageSidebar, NavList } from "@patternfly/react-core";

import { Paths } from "Paths";
import { LayoutTheme } from "../LayoutUtils";
import { useKcPermission } from "shared/hooks";
import { VisibilityByPermission } from "shared/components";

export const SidebarApp: React.FC = () => {
  // i18
  const { t } = useTranslation();

  // Location
  const { search } = useLocation();

  const renderPageNav = () => {
    return (
      <Nav id="nav-primary" aria-label="Nav" theme={LayoutTheme}>
        <NavList title="Global">
          <VisibilityByPermission
            permissionsAllowed={["inventory:application:read"]}
          >
            <NavItem>
              <NavLink
                to={Paths.applicationInventory + search}
                activeClassName="pf-m-current"
              >
                {t("sidebar.applicationInventory")}
              </NavLink>
            </NavItem>
          </VisibilityByPermission>
          <VisibilityByPermission
            permissionsAllowed={["inventory:application:read"]}
          >
            <NavItem>
              <NavLink
                to={Paths.reports + search}
                activeClassName="pf-m-current"
              >
                {t("sidebar.reports")}
              </NavLink>
            </NavItem>
          </VisibilityByPermission>
          <VisibilityByPermission permissionsAllowed={["controls:read"]}>
            <NavItem>
              <NavLink to={Paths.controls} activeClassName="pf-m-current">
                {t("sidebar.controls")}
              </NavLink>
            </NavItem>
          </VisibilityByPermission>
        </NavList>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
