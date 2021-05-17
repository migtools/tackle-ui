/// <reference types="cypress" />

describe("Not found assessment", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Interceptors
    cy.intercept("GET", "/api/pathfinder/assessments/*").as("getAssessmentApi");
  });

  it("Should show 'not available'", () => {
    // Go to page
    cy.visit("/application-inventory/assessment/-1");

    // Wait
    cy.wait("@getAssessmentApi");

    // Verify
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("Not available");
  });
});
