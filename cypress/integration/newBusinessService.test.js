/// <reference types="cypress" />

context("Test NewBusinessService", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => {
      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/hal+json",
        Authorization: "Bearer " + tokens.access_token,
      };

      // Delete all business services
      cy.request({
        method: "GET",
        headers: headers,
        url: `${Cypress.env("controls_base_url")}/business-service?size=1000`,
      }).then((result) => {
        result.body._embedded["business-service"].forEach((e) => {
          cy.request({
            method: "DELETE",
            headers: headers,
            url: `${Cypress.env("controls_base_url")}/business-service/${e.id}`,
          });
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
});
