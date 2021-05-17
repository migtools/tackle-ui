/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { BusinessService } from "../../../models/business-service";

describe("Create new business service", () => {
  const businessService = new BusinessService();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");

      // Stakeholders for dropdown
      [...Array(3)]
        .map((_, i) => ({
          email: `email-${(i + 10).toString(36)}@domain.com`,
          displayName: `stakeholder-${(i + 10).toString(36)}`,
        }))
        .forEach((payload) => {
          cy.api_create(tokens, "Stakeholder", payload);
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "BusinessService");
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/business-service*").as(
      "getBusinessServices"
    );
    cy.intercept("POST", "/api/controls/business-service*").as(
      "postBusinessService"
    );
  });

  it("With min data", () => {
    businessService.create({
      name: "mybusinessservice",
    });
    cy.wait("@postBusinessService");

    // Verify table
    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "mybusinessservice");
  });

  it("With description", () => {
    businessService.create({
      name: "mybusinessservice",
      description: "mydescription",
    });
    cy.wait("@postBusinessService");

    // Verify table
    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "mybusinessservice")
      .should("contain", "mydescription");
  });

  it("With owner", () => {
    businessService.create({
      name: "mybusinessservice",
      owner: "stakeholder-a",
    });
    cy.wait("@postBusinessService");

    // Verify table
    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "mybusinessservice")
      .should("contain", "stakeholder-a");
  });
});
