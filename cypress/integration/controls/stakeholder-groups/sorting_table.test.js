/// <reference types="cypress" />

describe("Stakeholder groups table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    const stakeholders = [];

    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));
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

    cy.intercept({
      method: "GET",
      path: `/api/controls/stakeholder-group*`,
    }).as("getTableDataApi");

    cy.visit("/controls/stakeholder-groups");
  });

  it("Sort by name", () => {
    // Asc is the default
    cy.wait("@getTableDataApi");
    cy.pf4_table_verify_columnIsAsc("Name");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("group-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Name");
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("group-b");
  });

  it("Sort by members", () => {
    cy.wait("@getTableDataApi");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Member(s)");
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("group-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Member(s)");
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("group-b");
  });
});
