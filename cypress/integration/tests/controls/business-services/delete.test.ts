/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { BusinessService } from "../../../models/business-service";

describe("Delete business service", () => {
  const businessService = new BusinessService();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "BusinessService");
      cy.api_crud(tokens, "BusinessService", "POST", {
        name: "service-a",
      });
    });

    // Interceptors
    cy.intercept("DELETE", "/api/controls/business-service/*").as(
      "deleteBusinessService"
    );
    cy.intercept("GET", "/api/controls/business-service*").as(
      "getBusinessServices"
    );
  });

  it("Delete the only item available", () => {
    businessService.delete(0);
    cy.wait("@deleteBusinessService");

    // Verify table
    cy.wait("@getBusinessServices");
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No business services available");
  });
});
