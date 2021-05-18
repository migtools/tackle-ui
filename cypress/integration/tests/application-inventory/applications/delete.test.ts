/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Application } from "../../../models/application";

describe("Delete application", () => {
  const application = new Application();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Application");
      cy.api_crud(tokens, "Application", {
        name: "application-a",
      });
    });

    // Interceptors
    cy.intercept("DELETE", "/api/application-inventory/application/*").as(
      "deleteApplication"
    );
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplications"
    );
  });

  it("Delete the only item available", () => {
    application.delete(0);
    cy.wait("@deleteApplication");

    // Verify table
    cy.wait("@getApplications");
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No applications available");
  });
});
