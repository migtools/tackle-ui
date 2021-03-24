/// <reference types="cypress" />

describe("Applications table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => cy.tackleAppInventoryClean(tokens));
    cy.get("@tokens").then((tokens) => {
      cy.log("Create applications").then(() => {
        return [...Array(11)]
          .map((_, i) => ({
            name: `application-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createApplication(payload, tokens);
          });
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.intercept({
      method: "GET",
      path: `/api/application-inventory/application*`,
    }).as("getTableDataApi");

    cy.visit("/application-inventory");
  });

  it("Sort by name", () => {
    // Asc is the default
    cy.wait("@getTableDataApi");
    cy.pf4_table_verify_columnIsAsc("Name");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Name");
    cy.wait("@getTableDataApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-b");
  });
});
