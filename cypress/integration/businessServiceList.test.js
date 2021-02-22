/// <reference types="cypress" />

context("Test business service list", () => {
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

      // Create business services
      for (let i = 1; i <= 12; i++) {
        cy.request({
          method: "POST",
          headers: headers,
          body: {
            name: `service${i}`,
            description: `description${i}`,
          },
          url: `${Cypress.env("controls_base_url")}/business-service`,
        });
      }
    });
  });

  it("Filtering", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/business-service",
    }).as("apiCheck");

    cy.visit("/controls/business-services");

    //
    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 10);

    // Apply first filter
    cy.get("input[aria-label='filter-text']").type("service12");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 1).contains("service12");

    // Apply second filter
    cy.get("input[aria-label='filter-text']").type("service5");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 2).contains("service5");
  });

  it("Pagination", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/business-service",
    }).as("apiCheck");

    cy.visit("/controls/business-services");

    // Remember by default the table is sorted by name

    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("tbody > tr").contains("service1");
    cy.get("tbody > tr").contains("service7");

    cy.get("button[data-action='next']").first().click();
    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 2);
    cy.get("tbody > tr").contains("service8");
    cy.get("tbody > tr").contains("service9");

    cy.get("button[data-action='previous']").first().click();
    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("tbody > tr").contains("service1");
    cy.get("tbody > tr").contains("service7");
  });

  it("Edit", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/business-service",
    }).as("apiCheck");

    cy.visit("/controls/business-services");

    cy.wait("@apiCheck");

    // Open modal
    cy.get("button[aria-label='edit']").first().click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").clear().type("my business service");
    cy.get("textarea[name='description']").clear().type("my description");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@apiCheck");

    // Verify table
    cy.get("tbody > tr").contains("my business service");
    cy.get("tbody > tr").contains("my description");
  });

  it("Company list - delete", () => {
    cy.intercept({
      method: "GET",
      path: "/api/controls/business-service*",
    }).as("apiCheck");

    cy.intercept({
      method: "DELETE",
      path: "/api/controls/business-service/*",
    }).as("apiDeleteCheck");

    cy.visit("/controls/business-services");

    cy.wait("@apiCheck");

    // Verify table has 12 elements
    cy.get(".pf-c-options-menu__toggle-text").contains(12);

    // Open delete modal
    cy.get("button[aria-label='delete']").first().click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@apiDeleteCheck");
    cy.wait("@apiCheck");

    // Verify company has been deleted
    cy.get(".pf-c-options-menu__toggle-text").contains(11);
  });
});
