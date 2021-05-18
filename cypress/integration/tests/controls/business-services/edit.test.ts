/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { BusinessService } from "../../../models/business-service";

describe("Edit business service", () => {
  const businessService = new BusinessService();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_clean(tokens, "BusinessService");

      const stakeholders = [];

      // Stakeholders for dropdown
      [...Array(3)]
        .map((_, i) => ({
          email: `email-${(i + 10).toString(36)}@domain.com`,
          displayName: `stakeholder-${(i + 10).toString(36)}`,
        }))
        .forEach((payload) => {
          cy.api_crud(tokens, "Stakeholder", "POST", payload).then(
            (responseData) => {
              stakeholders.push(responseData);
            }
          );
        });

      // Business service to edit
      cy.api_crud(tokens, "BusinessService", "POST", {
        name: "service-a",
        owner: stakeholders[0],
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Interceptors
    cy.intercept("GET", "/api/controls/business-service*").as(
      "getBusinessServices"
    );
    cy.intercept("PUT", "/api/controls/business-service/*").as(
      "putBusinessService"
    );
  });

  it("Name and description", () => {
    businessService.edit(0, {
      name: "newName",
      description: "newDescription",
    });
    cy.wait("@putBusinessService");

    // Verify table
    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "newDescription");
  });

  it("Owner", () => {
    businessService.edit(0, {
      name: "newName",
      owner: "stakeholder-b",
    });
    cy.wait("@putBusinessService");

    // Verify table
    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "stakeholder-b");
  });
});
