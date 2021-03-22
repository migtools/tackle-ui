/// <reference types="cypress" />

context("Reset table after deletion", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => {
      cy.log("Clear DB")
        .then(() => cy.tackleControlsClean(tokens))

        // Create stakeholders
        .then(() => {
          return [...Array(21)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder${i + 1}`,
            }))
            .forEach((payload) => {
              cy.createStakeholder(payload, tokens);
            });
        });
    });

    cy.visit("/controls/stakeholders");
  });

  it("Delete last item from current page should move back page", () => {
    cy.intercept({
      method: "GET",
      path: "/api/controls/stakeholder*",
    }).as("getTableDataApi");

    cy.intercept({
      method: "DELETE",
      path: "/api/controls/stakeholder/*",
    }).as("deleteRequestApi");

    cy.wait("@getTableDataApi");

    // Verify table elements
    cy.pf4_pagination_verify_total(21);

    // Go to last page
    cy.pf4_pagination_action_goToPage(3);
    cy.pf4_pagination_select_currentPageInput().should("have.value", 3);

    // Open delete modal
    cy.get("button[aria-label='delete']").first().click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteRequestApi");
    cy.wait("@getTableDataApi");

    // Verify table elements
    cy.pf4_pagination_verify_total(20);

    // Verify current page has moved from 3 to 2
    cy.pf4_pagination_select_currentPageInput().should("have.value", 2);
  });

  it("Delete item from current page with more than 1 row should not change pagination", () => {
    cy.intercept({
      method: "GET",
      path: "/api/controls/stakeholder*",
    }).as("getTableDataApi");

    cy.intercept({
      method: "DELETE",
      path: "/api/controls/stakeholder/*",
    }).as("deleteRequestApi");

    cy.wait("@getTableDataApi");

    // Verify table elements
    cy.pf4_pagination_verify_total(21);

    // Go to 2nd page
    cy.pf4_pagination_action_goToPage(2);
    cy.pf4_pagination_select_currentPageInput().should("have.value", 2);

    // Open delete modal
    cy.get("button[aria-label='delete']").first().click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteRequestApi");
    cy.wait("@getTableDataApi");

    // Verify table elements
    cy.pf4_pagination_verify_total(20);

    // Verify current page has not changed
    cy.pf4_pagination_select_currentPageInput().should("have.value", 2);
  });
});
