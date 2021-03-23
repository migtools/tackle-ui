/// <reference types="cypress" />

context("Stakeholders table", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => {
      cy.tackleControlsClean(tokens);
    });

    cy.get("@tokens").then((tokens) => {
      cy.log("Create table rows")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.createStakeholder(payload, tokens);
            });
        })
        .then(() => {});
    });

    //
    cy.intercept({
      method: "GET",
      path: `/api/controls/stakeholder*`,
    }).as("getTableDataApi");

    cy.visit("/controls/stakeholders");
  });

  it("Default sorting", () => {
    cy.wait("@getTableDataApi");
    cy.pf4_table_verify_columnIsAsc("Email");

    cy.get(".pf-c-table > tbody > tr")
      .not(".pf-m-expanded")
      .eq(0)
      .contains("email-a@domain.com");

    cy.get(".pf-c-table > tbody > tr")
      .not(".pf-m-expanded")
      .eq(9)
      .contains("email-j@domain.com");
  });

  it("Sort by email:desc", () => {
    cy.wait("@getTableDataApi");
    cy.pf4_table_toggle_column("Email");

    // Verify
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table > tbody > tr")
      .not(".pf-m-expanded")
      .eq(0)
      .contains("email-k@domain.com");

    cy.get(".pf-c-table > tbody > tr")
      .not(".pf-m-expanded")
      .eq(9)
      .contains("email-b@domain.com");
  });

  it("Sort by displayName:asc", () => {
    cy.wait("@getTableDataApi");
    cy.pf4_table_toggle_column("Display name");

    // Verify
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table > tbody > tr")
      .not(".pf-m-expanded")
      .eq(0)
      .contains("stakeholder-a");

    cy.get(".pf-c-table > tbody > tr")
      .not(".pf-m-expanded")
      .eq(9)
      .contains("stakeholder-j");
  });
});
