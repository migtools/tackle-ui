/// <reference types="cypress" />

describe("Delete stakeholder", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));
    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholder").then(() => {
        const payload = {
          email: "email-a@domain.com",
          displayName: "stakeholder-a",
        };
        return cy.createStakeholder(payload, tokens);
      });
    });

    cy.intercept({
      method: "GET",
      path: `/api/controls/stakeholder*`,
    }).as("getTableDataApi");
    cy.intercept({
      method: "DELETE",
      path: `/api/controls/stakeholder/*`,
    }).as("deleteTableRowApi");

    cy.visit("/controls/stakeholders");
  });

  it("Delete last item", () => {
    cy.wait("@getTableDataApi");
    cy.pf4_table_select_mainRows().eq(0).contains("email-a@domain.com");

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
    ).contains("No stakeholders available");
  });
});
