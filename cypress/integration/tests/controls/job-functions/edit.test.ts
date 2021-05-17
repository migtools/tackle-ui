/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { JobFunctions } from "../../../models/job-function";

describe("Edit job function", () => {
  const jobFunctions = new JobFunctions();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "JobFunction");
      cy.api_create(tokens, "JobFunction", {
        role: "function-a",
      });
    });

    // Interceptors
    cy.intercept("PUT", "/api/controls/job-function/*").as("putJobFunction");
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctions");
  });

  it("Edit name", () => {
    jobFunctions.edit(0, {
      name: "newName",
    });
    cy.wait("@putJobFunction");

    // Verify table
    cy.wait("@getJobFunctions");
    (cy.get(".pf-c-table") as any)
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Name']")
      .should("contain", "newName");
  });
});
