/// <reference types="cypress" />

describe("Delete stakeholder group", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholder group").then(() => {
        const payload = {
          name: "group-a",
        };
        return cy.createStakeholderGroup(payload, tokens);
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder-group*").as(
      "getStakeholderGroupsApi"
    );
    cy.intercept("DELETE", "/api/controls/stakeholder-group/*").as(
      "deleteStakeholderGroupApi"
    );

    // Go to page
    cy.visit("/controls/stakeholder-groups");
  });

  it("Delete last item", () => {
    cy.wait("@getStakeholderGroupsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");

    // Delete
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='delete']")
      .first()
      .click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteStakeholderGroupApi");
    cy.wait("@getStakeholderGroupsApi");

    // Verify
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No stakeholder groups available");
  });
});
