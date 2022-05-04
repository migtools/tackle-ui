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
export const formatPath = (path: Paths, data: any) => {
  let url = path as string;

  for (const k of Object.keys(data)) {
    url = url.replace(":" + k, data[k]);
  }

  return url;
};

export enum Paths {
  base = "/",
  notFound = "/not-found",

  applicationInventory = "/application-inventory",
  applicationInventory_applicationList = "/application-inventory/application-list",
  applicationInventory_manageImports = "/application-inventory/application-imports",
  applicationInventory_manageImports_details = "/application-inventory/application-imports/:importId",
  applicationInventory_assessment = "/application-inventory/assessment/:assessmentId",
  applicationInventory_review = "/application-inventory/application/:applicationId/review",

  reports = "/reports",

  controls = "/controls",
  controls_businessServices = "/controls/business-services",
  controls_stakeholders = "/controls/stakeholders",
  controls_stakeholderGroups = "/controls/stakeholder-groups",
  controls_jobFunctions = "/controls/job-functions",
  controls_tags = "/controls/tags",
}

export interface AssessmentRoute {
  assessmentId: string;
}

export interface ReviewRoute {
  applicationId: string;
}

export interface ImportSummaryRoute {
  importId: string;
}
