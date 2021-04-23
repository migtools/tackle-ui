/// <reference types="cypress" />

describe("Edit job function", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clear controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data

    cy.get("@tokens").then((tokens) => {
      cy.log("Create job function").then(() => {
        const payload = {
          role: `function-a`,
        };
        return cy.createJobFunction(payload, tokens);
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctionsApi");
    cy.intercept("PUT", "/api/controls/job-function/*").as(
      "updateJobFunctionApi"
    );

    // Go to page
    cy.visit("/controls/job-functions");
  });

  it("Name", () => {
    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").clear().type("newName");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateJobFunctionApi");
    cy.wait("@getJobFunctionsApi");

    // Verify table
    cy.get(".pf-c-table").pf4_table_rows().eq(0).should("contain", "newName");
  });
});
