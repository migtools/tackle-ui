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

describe("Edit job function", () => {
  const jobFunctionsPage = new JobFunctionsPage();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "JobFunction");
      cy.api_crud(tokens, "JobFunction", "POST", {
        role: "function-a",
      });
    });
  });

  it("Edit name", () => {
    jobFunctionsPage.edit(0, {
      name: "newName",
    });

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Name']")
      .should("contain", "newName");
  });
});
