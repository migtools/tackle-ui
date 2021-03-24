/// <reference types="cypress" />

describe("Edit business service", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clear controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    const stakeholders = [];

    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholders")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.createStakeholder(payload, tokens).then((data) => {
                stakeholders.push(data);
              });
            });
        })

        .log("Create business service")
        .then(() => {
          const payload = {
            name: `service-a`,
            owner: stakeholders[0],
          };
          return cy.createBusinessService(payload, tokens);
        });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/business-service*").as(
      "getBusinessServicesApi"
    );
    cy.intercept("PUT", "/api/controls/business-service/*").as(
      "updateBusinessServiceApi"
    );

    // Go to page
    cy.visit("/controls/business-services");
  });

  it("Name and description", () => {
    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").clear().type("newName");
    cy.get("textarea[name='description']").clear().type("newDescription");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateBusinessServiceApi");
    cy.wait("@getBusinessServicesApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "newDescription");
  });

  it("Owner", () => {
    cy.intercept("GET", "/api/controls/stakeholder*").as("getStakeholdersApi");

    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();
    cy.wait("@getStakeholdersApi");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .clear()
      .type("stakeholder-b")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateBusinessServiceApi");
    cy.wait("@getBusinessServicesApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "stakeholder-b");
  });
});
