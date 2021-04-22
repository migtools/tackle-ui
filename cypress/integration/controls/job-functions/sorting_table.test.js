/// <reference types="cypress" />

describe("Job function table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    const stakeholders = [];
    cy.get("@tokens").then((tokens) => {
      cy.log("Create jobFunctions").then(() => {
        return [...Array(11)]
          .map((_, i) => ({
            role: `function-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createJobFunction(payload, tokens);
          });
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Interceptors
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctionsApi");

    // Go to page
    cy.visit("/controls/job-functions");
  });

  it("Sort by name", () => {
    // Asc is the default
    cy.wait("@getJobFunctionsApi");
    cy.get(".pf-c-table").pf4_table_column_isAsc("Name");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("function-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Name");
    cy.wait("@getJobFunctionsApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("function-b");
  });
});
