/// <reference types="cypress" />

describe("Delete business service", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));
    cy.get("@tokens").then((tokens) => {
      cy.log("Create business service").then(() => {
        const payload = {
          name: "service-a",
        };
        return cy.createBusinessService(payload, tokens);
      });
    });

    cy.intercept({
      method: "GET",
      path: `/api/controls/business-service*`,
    }).as("getTableDataApi");
    cy.intercept({
      method: "DELETE",
      path: `/api/controls/business-service/*`,
    }).as("deleteTableRowApi");

    cy.visit("/controls/business-services");
  });

  it("Delete last item", () => {
    cy.wait("@getTableDataApi");
    cy.pf4_table_select_mainRows().eq(0).contains("service-a");

    // Delete
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='delete']")
      .first()
      .click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteTableRowApi");
    cy.wait("@getTableDataApi");

    // Verify
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No business services available");
  });
});
