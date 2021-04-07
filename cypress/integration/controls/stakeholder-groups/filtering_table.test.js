/// <reference types="cypress" />

describe("Stakeholder groups filtering table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    const stakeholders = [];

    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholders")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.createStakeholder(payload, tokens).then((data) => {
                stakeholders.push(data);
              });
            });
        })

        .log("Create stakeholder groups")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              name: `group-${(i + 10).toString(36)}`,
              description: `description-${(i + 10).toString(36)}`,
              stakeholders: stakeholders.slice(0, i),
            }))
            .forEach((payload) => {
              cy.createStakeholderGroup(payload, tokens);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Inteceptors
    cy.intercept("GET", "/api/controls/stakeholder-group*").as(
      "getStakeholderGroupsApi"
    );

    // Go to page
    cy.visit("/controls/stakeholder-groups");
  });

  it("By name", () => {
    // First filter
    cy.wait("@getStakeholderGroupsApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("group-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getStakeholderGroupsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");

    // Second filter
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("group-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getStakeholderGroupsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("group-k");
  });

  it("Filter by description", () => {
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("toggle");
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("select", 1).click();

    // First filter
    cy.wait("@getStakeholderGroupsApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("description-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getStakeholderGroupsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");

    // Second filter
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("description-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getStakeholderGroupsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("description-k");
  });

  it("Filter by member", () => {
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("toggle");
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("select", 2).click();

    // First filter
    cy.wait("@getStakeholderGroupsApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("stakeholder-j");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getStakeholderGroupsApi");
    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-description-list .pf-c-description-list__text")
      .contains("stakeholder-j");
  });
});
