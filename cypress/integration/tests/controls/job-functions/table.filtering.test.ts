/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { JobFunctions } from "../../../models/job-function";

describe("Filter job functions", () => {
  const jobFunctions = new JobFunctions();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Data
    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "JobFunction");

      [...Array(11)]
        .map((_, i) => ({
          role: `function-${(i + 10).toString(36)}`,
        }))
        .forEach((payload) => {
          cy.api_crud(tokens, "JobFunction", "POST", payload);
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Inteceptors
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctions");
  });

  it("By name", () => {
    jobFunctions.openPage();
    cy.wait("@getJobFunctions");

    // First filter
    jobFunctions.applyFilter(0, "function-a");

    cy.wait("@getJobFunctions");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-a");

    // Second filter
    jobFunctions.applyFilter(0, "function-k");

    cy.wait("@getJobFunctions");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("function-k");
  });
});
