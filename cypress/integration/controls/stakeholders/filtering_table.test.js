/// <reference types="cypress" />

describe("Stakeholders filtering table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    const stakeholderGroups = [];

    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholder groups")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              name: `group-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.createStakeholderGroup(payload, tokens).then((data) => {
                stakeholderGroups.push(data);
              });
            });
        })

        .log("Create stakeholders")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder-${(i + 10).toString(36)}`,
              stakeholderGroups: stakeholderGroups.slice(0, i),
            }))
            .forEach((payload) => {
              cy.createStakeholder(payload, tokens);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Inteceptors
    cy.intercept("GET", "/api/controls/stakeholder*").as("getStakeholdersApi");

    // Go to page
    cy.visit("/controls/stakeholders");
  });

  it("By email", () => {
    // First filter
    cy.wait("@getStakeholdersApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("email-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("email-a@domain.com");

    // Second filter

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("email-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("email-a@domain.com");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("email-k@domain.com");
  });

  it("Filter by displayName", () => {
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("toggle");
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("select", 1).click();

    // First filter
    cy.wait("@getStakeholdersApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("stakeholder-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("stakeholder-a");

    // Second filter

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("stakeholder-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("stakeholder-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("stakeholder-k");
  });

  it("Filter by group", () => {
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("toggle");
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("select", 3).click();

    // First filter
    cy.wait("@getStakeholdersApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("group-j");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-description-list .pf-c-description-list__text")
      .contains("group-j");
  });
});
