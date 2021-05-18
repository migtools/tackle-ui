/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Stakeholder } from "../../../models/stakeholder";

describe("Delete stakeholder", () => {
  const stakeholder = new Stakeholder();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_crud(tokens, "Stakeholder", "POST", {
        email: "email-a@domain.com",
        displayName: "stakeholder-a",
      });
    });

    // Interceptors
    cy.intercept("DELETE", "/api/controls/stakeholder/*").as(
      "deleteStakeholder"
    );
    cy.intercept("GET", "/api/controls/stakeholder*").as("getStakeholder");
  });

  it("Delete the only item available", () => {
    stakeholder.delete(0);
    cy.wait("@deleteStakeholder");

    // Verify table
    cy.wait("@getStakeholder");
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No stakeholders available");
  });
});
