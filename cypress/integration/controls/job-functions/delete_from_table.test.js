/// <reference types="cypress" />

describe("Delete job function", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create job function").then(() => {
        const payload = {
          role: "function-a",
        };
        return cy.createJobFunction(payload, tokens);
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctionsApi");
    cy.intercept("DELETE", "/api/controls/job-function/*").as(
      "deleteJobFunctionApi"
    );

    cy.visit("/controls/job-functions");
  });

  it("Delete last item", () => {
    cy.wait("@getJobFunctionsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-a");

    // Delete
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='delete']")
      .first()
      .click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteJobFunctionApi");
    cy.wait("@getJobFunctionsApi");

    // Verify
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No job functions available");
  });
});
