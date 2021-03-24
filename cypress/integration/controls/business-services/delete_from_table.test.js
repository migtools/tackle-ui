/// <reference types="cypress" />

describe("Delete business service", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create business service").then(() => {
        const payload = {
          name: "service-a",
        };
        return cy.createBusinessService(payload, tokens);
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/business-service*").as(
      "getBusinessServicesApi"
    );
    cy.intercept("DELETE", "/api/controls/business-service/*").as(
      "deleteBusinessServiceApi"
    );

    cy.visit("/controls/business-services");
  });

  it("Delete last item", () => {
    cy.wait("@getBusinessServicesApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-a");

    // Delete
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='delete']")
      .first()
      .click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteBusinessServiceApi");
    cy.wait("@getBusinessServicesApi");

    // Verify
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No business services available");
  });
});
