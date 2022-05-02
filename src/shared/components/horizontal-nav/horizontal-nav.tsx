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
import { NavLink } from "react-router-dom";

export interface HorizontalNavProps {
  navItems: { title: string; path: string }[];
}

export const HorizontalNav: React.FC<HorizontalNavProps> = ({ navItems }) => {
  return (
    <div className="pf-c-tabs">
      <ul className="pf-c-tabs__list">
        {navItems.map((f, index) => (
          <NavLink
            key={index}
            to={f.path}
            className="pf-c-tabs__item"
            activeClassName="pf-m-current"
          >
            <li key={index} className="pf-c-tabs__item">
              <button className="pf-c-tabs__link">
                <span className="pf-c-tabs__item-text">{f.title}</span>
              </button>
            </li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};
