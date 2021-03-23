/// <reference types="cypress" />

context("About modal", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice");
  });

  it("Should open modal", () => {
    cy.visit("/");

    cy.get("#aboutButton").click();
    cy.get(".pf-c-about-modal-box").contains("Source code");
    cy.get("button[aria-label='Close Dialog']").click();
  });
});
