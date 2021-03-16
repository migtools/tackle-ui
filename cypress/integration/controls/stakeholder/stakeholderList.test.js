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

      // Delete stakeholders
      cy.request({
        method: "GET",
        headers: headers,
        url: `${Cypress.env("controls_base_url")}/stakeholder?size=1000`,
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
                email: `email-${(i + 9).toString(36)}@domain.com`,
                displayName: `stakeholder${i}`,
              },
              url: `${Cypress.env("controls_base_url")}/stakeholder`,
            }).then((response) => {
              stakeholders.push(response.body);
            });
          }
        });
    });
  });

  it("Filtering", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/stakeholder",
    }).as("apiCheck");

    cy.visit("/controls/stakeholders");

    //
    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 10);

    // Apply first filter: 'byEmail'
    cy.get("input[aria-label='filter-text']").type("email-l");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 1)
      .contains("email-l@domain.com");

    // Apply second filter: 'byEmail'
    cy.get("input[aria-label='filter-text']").type("email-e");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 2)
      .should("contain", "email-l@domain.com")
      .should("contain", "email-e@domain.com");

    // Apply second filter: 'byDisplayName'
    cy.get(".pf-c-toolbar button.pf-c-dropdown__toggle").click();
    cy.get(".pf-c-dropdown__menu button.pf-c-dropdown__menu-item")
      .eq(1)
      .click();

    cy.get("input[aria-label='filter-text']").type("stakeholder1");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 1)
      .should("contain", "stakeholder12");

    // Clear all filters
    cy.get(".pf-c-toolbar__item > button.pf-m-link")
      .contains("Clear all filters")
      .click({ force: true });

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 10)
      .should("contain", "stakeholder1")
      .should("contain", "stakeholder10");
  });

  it("Pagination", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/stakeholder",
    }).as("apiCheck");

    cy.visit("/controls/stakeholders");

    // Remember that by default the table is sorted by name

    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("tbody > tr").contains("stakeholder1");
    cy.get("tbody > tr").contains("stakeholder10");

    cy.get("button[data-action='next']").first().click();
    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 2);
    cy.get("tbody > tr").contains("stakeholder11");
    cy.get("tbody > tr").contains("stakeholder12");

    cy.get("button[data-action='previous']").first().click();
    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("tbody > tr").contains("stakeholder1");
    cy.get("tbody > tr").contains("stakeholder10");
  });

  it("Sorting", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/stakeholder",
    }).as("apiCheck");

    cy.visit("/controls/stakeholders");

    // Verify default sort
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .first()
      .should("have.attr", "aria-sort", "ascending")
      .contains("Email");
    cy.get("tbody > tr").eq(0).contains("stakeholder1");
    cy.get("tbody > tr").eq(9).contains("stakeholder10");

    // Reverse sort
    cy.get("th.pf-c-table__sort > button").first().click();
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .first()
      .should("have.attr", "aria-sort", "descending")
      .contains("Email");
    cy.get("tbody > tr").eq(0).contains("stakeholder12");
    cy.get("tbody > tr").eq(9).contains("stakeholder3");

    // Sort by displayName
    cy.get("th.pf-c-table__sort > button").contains("Display name").click();
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .eq(1)
      .should("have.attr", "aria-sort", "ascending")
      .contains("Display name");
    cy.get("tbody > tr").eq(0).contains("stakeholder1");
    cy.get("tbody > tr").eq(9).contains("stakeholder7");

    // Reverse sort
    cy.get("th.pf-c-table__sort > button").contains("Display name").click();
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .eq(1)
      .should("have.attr", "aria-sort", "descending")
      .contains("Display name");
    cy.get("tbody > tr").eq(0).contains("stakeholder9");
    cy.get("tbody > tr").eq(9).contains("stakeholder11");

    // TODO test by job function and owner
  });

  it("Create new - mininum data", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/stakeholder",
    }).as("apiCheck");

    cy.visit("/controls/stakeholders");

    // Open modal
    cy.get("button[aria-label='create-stakeholder']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='email']").type("aaa@domain.com");
    cy.get("input[name='displayName']").type("myDisplayName");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@apiCheck");

    // Verify table
    cy.get("tbody > tr")
      .should("contain", "aaa@domain.com")
      .should("contain", "myDisplayName");
  });

  it("Create new", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/stakeholder",
    }).as("apiCheckGetStakeholders");

    cy.intercept({
      method: "GET",
      url: "/api/controls/job-function",
    }).as("apiCheckGetJobFunction");

    cy.visit("/controls/stakeholders");

    // Open modal
    cy.get("button[aria-label='create-stakeholder']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.wait("@apiCheckGetJobFunction");

    cy.get("input[name='email']").type("aaa@domain.com");
    cy.get("input[name='displayName']").type("myDisplayName");

    cy.get(".pf-c-form__group-control button.pf-c-select__toggle-button")
      .eq(0)
      .click();
    cy.get(
      ".pf-c-form__group-control .pf-c-form-control.pf-c-select__toggle-typeahead"
    )
      .eq(0)
      .type("Business Analyst");
    cy.get("button.pf-c-select__menu-item")
      .eq(0)
      .click({ waitForAnimations: false });

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@apiCheckGetStakeholders");

    // Verify table
    cy.get("tbody > tr")
      .should("contain", "aaa@domain.com")
      .should("contain", "myDisplayName")
      .should("contain", "Business Analyst");
  });

  it("Edit", () => {
    cy.intercept({
      method: "GET",
      url: "/api/controls/stakeholder",
    }).as("apiCheck");

    cy.visit("/controls/stakeholders");

    cy.wait("@apiCheck");

    // Open modal
    cy.get("button[aria-label='edit']").first().click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='email']").clear().type("aaa@domain.com");
    cy.get("input[name='displayName']").clear().type("myDisplayName");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@apiCheck");

    // Verify table
    cy.get("tbody > tr").contains("aaa@domain.com");
    cy.get("tbody > tr").contains("myDisplayName");
  });

  it("Delete", () => {
    cy.intercept({
      method: "GET",
      path: "/api/controls/stakeholder*",
    }).as("apiCheck");

    cy.intercept({
      method: "DELETE",
      path: "/api/controls/stakeholder/*",
    }).as("apiDeleteCheck");

    cy.visit("/controls/stakeholders");

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
