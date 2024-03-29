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

import { BusinessServicePage } from "../../../models/business-service";

describe("Edit business service", () => {
  const businessServicePage = new BusinessServicePage();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_clean(tokens, "BusinessService");

      const stakeholders = [];

      cy.log("")
        .then(() => {
          // Stakeholders for dropdown
          return [...Array(3)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(
                tokens,
                "Stakeholder",
                "POST",
                payload
              ).then((responseData) => stakeholders.push(responseData));
            });
        })
        .then(() => {
          // Business service to edit
          return cy.api_crud(tokens, "BusinessService", "POST", {
            name: "service-a",
            owner: stakeholders[0],
          });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");
  });

  it("Name and description", () => {
    businessServicePage.edit(0, {
      name: "newName",
      description: "newDescription",
    });

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "newDescription");
  });

  it("Owner", () => {
    businessServicePage.edit(0, {
      name: "newName",
      owner: "stakeholder-b",
    });

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "stakeholder-b");
  });
});
