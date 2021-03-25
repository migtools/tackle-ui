/// <reference types="cypress" />

describe("Delete stakeholder", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholder").then(() => {
        const payload = {
          email: "email-a@domain.com",
          displayName: "stakeholder-a",
        };
        return cy.createStakeholder(payload, tokens);
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder*").as("getStakeholdersApi");
    cy.intercept("DELETE", "/api/controls/stakeholder/*").as(
      "deleteStakeholderApi"
    );

    // Go to page
    cy.visit("/controls/stakeholders");
  });

  it("Delete last item", () => {
    cy.wait("@getStakeholdersApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("email-a@domain.com");

    // Delete
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='delete']")
      .first()
      .click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteStakeholderApi");
    cy.wait("@getStakeholdersApi");

    // Verify
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No stakeholders available");
  });
});
