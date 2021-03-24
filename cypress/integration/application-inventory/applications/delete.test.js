/// <reference types="cypress" />

describe("Delete application", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => cy.tackleAppInventoryClean(tokens));
    cy.get("@tokens").then((tokens) => {
      cy.log("Create application").then(() => {
        const payload = {
          name: "application-a",
        };
        return cy.createApplication(payload, tokens);
      });
    });

    cy.intercept({
      method: "GET",
      path: `/api/application-inventory/application*`,
    }).as("getTableDataApi");
    cy.intercept({
      method: "DELETE",
      path: `/api/application-inventory/application/*`,
    }).as("deleteTableRowApi");

    cy.visit("/application-inventory");
  });

  it("Delete last item", () => {
    cy.wait("@getTableDataApi");
    cy.pf4_table_select_mainRows().eq(0).contains("application-a");

    // Delete
    cy.pf4_table_select_kebabAction("Delete").click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteTableRowApi");
    cy.wait("@getTableDataApi");

    // Verify
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No applications available");
  });
});
