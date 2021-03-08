/// <reference types="cypress" />

context("Test business service list", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/hal+json",
        Authorization: "Bearer " + tokens.access_token,
      };

      const stakeholders = [];

      // Delete business services
      cy.request({
        method: "GET",
        headers: headers,
        url: `${Cypress.env("controls_base_url")}/business-service?size=1000`,
      })
        .then((response) => {
          response.body._embedded["business-service"].forEach((elem) => {
            cy.request({
              method: "DELETE",
              headers: headers,
              url: `${Cypress.env("controls_base_url")}/business-service/${
                elem.id
              }`,
            });
          });
        })

        // Delete stakeholders
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
                email: `email${i}@domain.com`,
                displayName: `stakeholder${i}`,
              },
              url: `${Cypress.env("controls_base_url")}/stakeholder`,
            }).then((response) => {
              stakeholders.push(response.body);
            });
          }
        })

        // Create business services
        .then(() => {
          for (let i = 1; i <= 12; i++) {
            cy.request({
              method: "POST",
              headers: headers,
              body: {
                name: `service${i}`,
                description: `description${i}`,
                owner: stakeholders[12 - i],
              },
              url: `${Cypress.env("controls_base_url")}/business-service`,
            });
          }
        });
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

    // Apply first filter: 'byName'
    cy.get("input[aria-label='filter-text']").type("service12");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 1).contains("service12");

    // Apply second filter: 'byName'
    cy.get("input[aria-label='filter-text']").type("service5");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 2)
      .should("contain", "service12")
      .should("contain", "service5");

    // Apply second filter: 'byOwner'
    cy.get(".pf-c-toolbar button.pf-c-dropdown__toggle").click();
    cy.get(".pf-c-dropdown__menu button.pf-c-dropdown__menu-item")
      .eq(2)
      .click();

    cy.get("input[aria-label='filter-text']").type("stakeholder1");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 1)
      .should("contain", "service12");

    // Remove filter 'byOwner' chip
    cy.get(".pf-c-chip button.pf-c-button").eq(2).click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 2)
      .should("contain", "service12")
      .should("contain", "service5");

    // Clear all filters
    cy.get(".pf-c-toolbar__item > button.pf-m-link")
      .contains("Clear all filters")
      .click({ force: true });

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 10)
      .should("contain", "service1")
      .should("contain", "service7");
  });

  it("Pagination", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/business-service",
    }).as("apiCheck");

    cy.visit("/controls/business-services");

    // Remember that by default the table is sorted by name

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

  it("Sorting", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/business-service",
    }).as("apiCheck");

    cy.visit("/controls/business-services");

    // Verify default sort
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .first()
      .should("have.attr", "aria-sort", "ascending")
      .contains("Name");
    cy.get("tbody > tr").eq(0).contains("service1");
    cy.get("tbody > tr").eq(9).contains("service7");

    // Reverse sort
    cy.get("th.pf-c-table__sort > button").first().click();
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .first()
      .should("have.attr", "aria-sort", "descending")
      .contains("Name");
    cy.get("tbody > tr").eq(0).contains("service9");
    cy.get("tbody > tr").eq(9).contains("service11");

    // Sort by owner
    cy.get("th.pf-c-table__sort > button").contains("Owner").click();
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .eq(1)
      .should("have.attr", "aria-sort", "ascending")
      .contains("Owner");
    cy.get("tbody > tr").eq(0).contains("stakeholder1");
    cy.get("tbody > tr").eq(9).contains("stakeholder7");

    // Reverse sort
    cy.get("th.pf-c-table__sort > button").contains("Owner").click();
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .eq(1)
      .should("have.attr", "aria-sort", "descending")
      .contains("Owner");
    cy.get("tbody > tr").eq(0).contains("stakeholder9");
    cy.get("tbody > tr").eq(9).contains("stakeholder11");
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
