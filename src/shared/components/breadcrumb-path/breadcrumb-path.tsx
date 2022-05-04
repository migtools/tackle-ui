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
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button } from "@patternfly/react-core";

export interface BreadCrumbPathProps {
  breadcrumbs: { title: string; path: string | (() => void) }[];
}

export const BreadCrumbPath: React.FC<BreadCrumbPathProps> = ({
  breadcrumbs,
}) => {
  return (
    <Breadcrumb>
      {breadcrumbs.map((crumb, i, { length }) => {
        const isLast = i === length - 1;

        const link =
          typeof crumb.path === "string" ? (
            <Link className="pf-c-breadcrumb__link" to={crumb.path}>
              {crumb.title}
            </Link>
          ) : (
            <Button variant="link" isInline onClick={crumb.path}>
              {crumb.title}
            </Button>
          );

        return (
          <BreadcrumbItem key={i} isActive={isLast}>
            {isLast ? crumb.title : link}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};
