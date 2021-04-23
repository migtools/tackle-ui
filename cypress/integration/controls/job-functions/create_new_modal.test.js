/// <reference types="cypress" />

describe("Create new job function", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Interceptors
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctionApi");
    cy.intercept("POST", "/api/controls/job-function*").as(
      "createJobFunctionApi"
    );

    // Go to page
    cy.visit("/controls/job-functions");
  });

  it("With min data", () => {
    // Open modal
    cy.get("button[aria-label='create-job-function']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("myjobfunction");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createJobFunctionApi");
    cy.wait("@getJobFunctionApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myjobfunction");
  });
});
