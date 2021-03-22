/// <reference types="cypress" />

context("Test NewBusinessService", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => {
      cy.log("Clear DB")
        .then(() => cy.tackleControlsClean(tokens))

        // Create stakeholders
        .then(() => {
          return [...Array(12)]
            .map((_, i) => ({
              email: `email${i + 1}@domain.com`,
              displayName: `stakeholder${i + 1}`,
            }))
            .forEach((payload) => {
              cy.createStakeholder(payload, tokens);
            });
        });
    });
  });

  it("Minimun data", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/business-service",
    }).as("apiCheck");

    cy.visit("/controls/business-services");

    // Open modal
    cy.get("button[aria-label='create-business-service']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("my business service");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@apiCheck");

    // Verify table
    cy.get("tbody > tr")
      .should("have.length", 1)
      .contains("my business service");
  });

  it("Fill all fields", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/business-service",
    }).as("apiCheckBusinessService");

    cy.intercept({
      method: "GET",
      url: "/api/controls/stakeholder",
    }).as("apiCheckStakeholder");

    cy.visit("/controls/business-services");

    // Open modal
    cy.get("button[aria-label='create-business-service']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.wait("@apiCheckStakeholder");
    cy.get("input[name='name']").type("my name");
    cy.get("textarea[name='description']").type("my description");

    cy.get("button.pf-c-select__toggle-button").click();
    cy.get("button.pf-c-select__menu-item")
      .eq(0)
      .click({ waitForAnimations: false });

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@apiCheckBusinessService");

    // Verify table
    cy.get("tbody > tr")
      .should("have.length", 1)
      .should("contain", "my name")
      .and("contain", "my description")
      .and("contain", "stakeholder1");
  });
});
