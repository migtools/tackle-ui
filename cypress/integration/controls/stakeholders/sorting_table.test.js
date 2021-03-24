/// <reference types="cypress" />

describe("Stakeholders table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    const stakeholderGroups = [];

    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));
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

    cy.intercept({
      method: "GET",
      path: `/api/controls/stakeholder*`,
    }).as("getTableDataApi");

    cy.visit("/controls/stakeholders");
  });

  it("Sort by email", () => {
    // Asc is the default
    cy.wait("@getTableDataApi");
    cy.pf4_table_verify_columnIsAsc("Email");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("email-a@domain.com");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("email-j@domain.com");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Email");
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("email-k@domain.com");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("email-b@domain.com");
  });

  it("Sort by displayName", () => {
    cy.wait("@getTableDataApi");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Display name");
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("stakeholder-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("stakeholder-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Display name");
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("stakeholder-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("stakeholder-b");
  });

  it("Sort by groups", () => {
    cy.wait("@getTableDataApi");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Group(s)");
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("0");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("9");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Group(s)");
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("10");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("1");
  });
});
