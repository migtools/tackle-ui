import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Nav, NavItem, PageSidebar, NavList } from "@patternfly/react-core";

import { Paths } from "Paths";
import { LayoutTheme } from "../LayoutUtils";

export const SidebarApp: React.FC = () => {
  const { t } = useTranslation();

  const renderPageNav = () => {
    return (
      <Nav id="nav-primary" aria-label="Nav" theme={LayoutTheme}>
        <NavList title="Global">
          <NavItem>
            <NavLink
              to={Paths.applicationInventory}
              activeClassName="pf-m-current"
            >
              {t("sidebar.applicationInventory")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={Paths.reports} activeClassName="pf-m-current">
              {t("sidebar.reports")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to={Paths.controls} activeClassName="pf-m-current">
              {t("sidebar.controls")}
            </NavLink>
          </NavItem>
        </NavList>
        {/* <section className={styles.rhLogoSection}>
          <img src={redHatLogo} alt="Red Hat" />
        </section> */}
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
