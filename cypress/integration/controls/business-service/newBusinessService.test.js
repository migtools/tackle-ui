/// <reference types="cypress" />

context("Test NewBusinessService", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/hal+json",
        Authorization: "Bearer " + tokens.access_token,
      };

      // Delete all business services
      cy.request({
        method: "GET",
        headers: headers,
        url: `${Cypress.env("controls_base_url")}/business-service?size=1000`,
      })
        .then((result) => {
          result.body._embedded["business-service"].forEach((e) => {
            cy.request({
              method: "DELETE",
              headers: headers,
              url: `${Cypress.env("controls_base_url")}/business-service/${
                e.id
              }`,
            });
          });
        })

        // Delete all stakeholders
        .then(() => {
          cy.request({
            method: "GET",
            headers: headers,
            url: `${Cypress.env("controls_base_url")}/stakeholder?size=1000`,
          });
        })
        .then((response) => {
          response.body._embedded["stakeholder"].forEach((elem) => {
            cy.request({
              method: "DELETE",
              headers: headers,
              url: `${Cypress.env("controls_base_url")}/stakeholder/${elem.id}`,
            });
          });
        })

        // Create stakeholders
        .then(() => {
          for (let i = 1; i <= 12; i++) {
            cy.request({
              method: "POST",
              headers: headers,
              body: {
                name: `any`,
                displayName: `stakeholder${i}`,
              },
              url: `${Cypress.env("controls_base_url")}/stakeholder`,
            });
          }
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
