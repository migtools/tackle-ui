/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { JobFunctions } from "../../../models/job-function";

describe("Create job function", () => {
  const jobFunctions = new JobFunctions();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "JobFunction");
    });

    // Interceptors
    cy.intercept("POST", "/api/controls/job-function*").as("postJobFunction");
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctions");
  });

  it("With min data", () => {
    jobFunctions.create({
      name: "myJobFunction",
    });
    cy.wait("@postJobFunction");

    // Verify table
    cy.wait("@getJobFunctions");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Name']")
      .should("contain", "myJobFunction");
  });
});
