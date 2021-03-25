/// <reference types="cypress" />

describe("Delete application", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean app inventory
    cy.get("@tokens").then((tokens) => cy.tackleAppInventoryClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create application").then(() => {
        const payload = {
          name: "application-a",
        };
        return cy.createApplication(payload, tokens);
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplicationsApi"
    );
    cy.intercept("DELETE", "/api/application-inventory/application/*").as(
      "deleteApplicationApi"
    );

    cy.visit("/application-inventory");
  });

  it("Delete last item", () => {
    cy.wait("@getApplicationsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");

    // Delete
    cy.get(".pf-c-table").pf4_table_action_select(0, "Delete");
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteApplicationApi");
    cy.wait("@getApplicationsApi");

    // Verify
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No applications available");
  });
});
