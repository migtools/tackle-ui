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

      cy.log("Clear DB")
        .then(() => cy.tackleControlsClean(tokens))
        .then(() => cy.tackleAppInventoryClean(tokens))

        // Create business services
        .then(() => {
          return [...Array(12)]
            .map((_, i) => ({
              name: `service${i + 1}`,
              description: `description${i + 1}`,
            }))
            .forEach((payload) => {
              cy.createBusinessService(payload, tokens);
            });
        })

        // Create applications
        .then(() => {
          return [...Array(12)]
            .map((_, i) => ({
              name: `app-${(i + 10).toString(36)}`,
              description: `description${i}`,
            }))
            .forEach((payload) => {
              cy.createApplication(payload, tokens);
            });
        });
    });
  });

  it("Filtering", () => {
    cy.intercept({
      method: "GET",
      url: "/api/application-inventory/application",
    }).as("apiCheck");

    cy.visit("/application-inventory");

    //
    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 10);

    // Apply first filter: 'name'
    cy.get("input[aria-label='filter-text']").type("app-l");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 1).contains("app-l");

    // Apply second filter: 'name'
    cy.get("input[aria-label='filter-text']").type("app-e");
    cy.get("button[aria-label='search']").click();

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 2)
      .should("contain", "app-l")
      .should("contain", "app-e");

    // Clear all filters
    cy.get(".pf-c-toolbar__item > button.pf-m-link")
      .contains("Clear all filters")
      .click({ force: true });

    cy.wait("@apiCheck");
    cy.get("tbody > tr")
      .should("have.length", 10)
      .should("contain", "app-a")
      .should("contain", "app-j");
  });

  it("Pagination", () => {
    cy.intercept({
      method: "GET",
      url: "/api/application-inventory/application",
    }).as("apiCheck");

    cy.visit("/application-inventory");

    // Remember that by default the table is sorted by name

    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("tbody > tr").contains("app-a");
    cy.get("tbody > tr").contains("app-j");

    cy.get("button[data-action='next']").first().click();
    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 2);
    cy.get("tbody > tr").contains("app-k");
    cy.get("tbody > tr").contains("app-l");

    cy.get("button[data-action='previous']").first().click();
    cy.wait("@apiCheck");
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("tbody > tr").contains("app-a");
    cy.get("tbody > tr").contains("app-j");
  });

  it("Sorting", () => {
    cy.intercept({
      method: "GET",
      url: "/api/application-inventory/application",
    }).as("apiCheck");

    cy.visit("/application-inventory");

    // Verify default sort
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .first()
      .should("have.attr", "aria-sort", "ascending")
      .contains("Name");
    cy.get("tbody > tr").eq(0).contains("app-a");
    cy.get("tbody > tr").eq(9).contains("app-j");

    // Reverse sort
    cy.get("th.pf-c-table__sort > button").first().click();
    cy.wait("@apiCheck");
    cy.get("th.pf-c-table__sort")
      .first()
      .should("have.attr", "aria-sort", "descending")
      .contains("Name");
    cy.get("tbody > tr").eq(0).contains("app-l");
    cy.get("tbody > tr").eq(9).contains("app-c");
  });

  it("Create new - mininum data", () => {
    cy.intercept({
      method: "GET",
      url: "/api/application-inventory/application",
    }).as("apiCheck");

    cy.visit("/application-inventory");

    // Open modal
    cy.get("button[aria-label='create-application']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("aaaa"); // Using name 'aaa' to make it appear in the first page and then verify it

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@apiCheck");

    // Verify table
    cy.get("tbody > tr").should("contain", "aaaa");
  });

  it("Create new - with all data", () => {
    cy.intercept({
      method: "GET",
      url: "/api/application-inventory/application",
    }).as("apiCheck");
    cy.intercept({
      method: "GET",
      path: "/api/controls/business-service/*",
    }).as("apiBusinessServiceCheck");

    cy.visit("/application-inventory");

    // Open modal
    cy.get("button[aria-label='create-application']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("aaaa"); // Using name 'aaa' to make it appear in the first page and then verify it
    cy.get("input[name='description']").clear().type("my description");

    cy.get(".pf-c-select__toggle > .pf-c-button").click();
    cy.get(".pf-c-select .pf-c-select__menu-item")
      .eq(0)
      .click({ waitForAnimations: false });

    cy.get("textarea[name='comments']").clear().type("my comments");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait(["@apiCheck", "@apiBusinessServiceCheck"]);

    // Verify table
    cy.get("tbody > tr")
      .should("contain", "aaaa")
      .should("contain", "my description")
      .should("contain", "service1");

    cy.get(".pf-c-table .pf-c-table__toggle .pf-c-button").first().click();
    cy.get(
      ".pf-c-table .pf-c-table__expandable-row-content .pf-c-description-list__description"
    ).contains("my comments");
  });

  it("Edit", () => {
    cy.intercept({
      method: "GET",
      url: "/api/application-inventory/application",
    }).as("apiCheck");
    cy.intercept({
      method: "GET",
      path: "/api/controls/business-service/*",
    }).as("apiBusinessServiceCheck");

    cy.visit("/application-inventory");

    cy.wait("@apiCheck");

    // Open modal
    cy.get(".pf-c-table .pf-c-table__action .pf-c-dropdown__toggle")
      .first()
      .click();
    cy.get(
      ".pf-c-table .pf-c-table__action .pf-c-dropdown__menu .pf-c-dropdown__menu-item"
    )
      .contains("Edit")
      .click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").clear().type("aaa");
    cy.get("input[name='description']").clear().type("my description");

    cy.get(".pf-c-select__toggle > .pf-c-button").click();
    cy.get(".pf-c-select .pf-c-select__menu-item")
      .eq(0)
      .click({ waitForAnimations: false });

    cy.get("textarea[name='comments']").clear().type("my comments");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait(["@apiCheck", "@apiBusinessServiceCheck"]);

    // Verify table
    cy.get("tbody > tr").contains("aaa");
    cy.get("tbody > tr").contains("my description");
    cy.get("tbody > tr").contains("service1");

    cy.get(".pf-c-table .pf-c-table__toggle .pf-c-button").first().click();
    cy.get(
      ".pf-c-table .pf-c-table__expandable-row-content .pf-c-description-list__description"
    ).contains("my comments");
  });

  it("Delete", () => {
    cy.intercept({
      method: "GET",
      path: "/api/application-inventory/application*",
    }).as("apiCheck");

    cy.intercept({
      method: "DELETE",
      path: "/api/application-inventory/application/*",
    }).as("apiDeleteCheck");

    cy.visit("/application-inventory");

    cy.wait("@apiCheck");

    // Verify table has 12 elements
    cy.get(".pf-c-options-menu__toggle-text").contains(12);

    // Open delete modal
    cy.get(".pf-c-table .pf-c-table__action .pf-c-dropdown__toggle")
      .first()
      .click();
    cy.get(
      ".pf-c-table .pf-c-table__action .pf-c-dropdown__menu .pf-c-dropdown__menu-item"
    )
      .contains("Delete")
      .click();

    cy.get("button[aria-label='confirm']").click();

    cy.wait("@apiDeleteCheck");
    cy.wait("@apiCheck");

    // Verify company has been deleted
    cy.get(".pf-c-options-menu__toggle-text").contains(11);
  });
});
