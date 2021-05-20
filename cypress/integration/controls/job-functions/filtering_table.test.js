/// <reference types="cypress" />

describe("Job function filtering table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data

    cy.get("@tokens").then((tokens) => {
      cy.log("Create job functions").then(() => {
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

    // Inteceptors
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctionApi");

    // Go to page
    cy.visit("/controls/job-functions");
  });

  it("By name", () => {
    // First filter
    cy.wait("@getJobFunctionApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("function-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getJobFunctionApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-a");

    // Second filter

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("function-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getJobFunctionApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("function-k");
  });
});
