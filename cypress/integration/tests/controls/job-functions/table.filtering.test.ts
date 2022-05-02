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
/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { JobFunctionsPage } from "../../../models/job-function";

describe("Filter job functions", () => {
  const jobFunctionsPage = new JobFunctionsPage();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Data
    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "JobFunction");

      cy.log("").then(() => {
        [...Array(11)]
          .map((_, i) => ({
            role: `function-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.api_crud(tokens, "JobFunction", "POST", payload);
          });
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");
  });

  it("By name", () => {
    const filterIndex = 0;
    jobFunctionsPage.openPage();

    // First filter
    jobFunctionsPage.applyFilter(filterIndex, "function-a");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-a");

    // Second filter
    jobFunctionsPage.applyFilter(filterIndex, "function-k");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("function-k");
  });
});
