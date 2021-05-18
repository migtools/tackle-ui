/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { JobFunctions } from "../../../models/job-function";

describe("Sort job functions", () => {
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
          cy.api_crud(tokens, "JobFunction", payload);
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Inteceptors
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctions");
  });

  it("Sort by name", () => {
    jobFunctions.openPage();
    cy.wait("@getJobFunctions");

    // Asc is the default
    cy.get(".pf-c-table").pf4_table_column_isAsc("Name");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("function-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Name");
    cy.wait("@getJobFunctions");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("function-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("function-b");
  });
});
