/// <reference types="cypress" />

describe("Create new business service", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));
    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholders").then(() => {
        return [...Array(11)]
          .map((_, i) => ({
            email: `email-${(i + 10).toString(36)}@domain.com`,
            displayName: `stakeholder-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createStakeholder(payload, tokens);
          });
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) =>
      cy.tackleControlsCleanBusinessServices(tokens)
    );

    cy.intercept({
      method: "GET",
      path: `/api/controls/business-service*`,
    }).as("getTableDataApi");
    cy.intercept({
      method: "POST",
      path: `/api/controls/business-service*`,
    }).as("createDataApi");

    cy.visit("/controls/business-services");
  });

  it("With min data", () => {
    // Open modal
    cy.get("button[aria-label='create-business-service']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("mybusinessservice");
    cy.get("textarea[name='description']").type("mydescription");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.pf4_table_select_mainRows()
      .eq(0)
      .should("contain", "mybusinessservice")
      .should("contain", "mydescription");
  });

  it("With owner", () => {
    cy.intercept({
      method: "GET",
      path: "/api/controls/stakeholder*",
    }).as("apiCheckGetStakeholder");

    // Open modal
    cy.get("button[aria-label='create-business-service']").click();
    cy.wait("@apiCheckGetStakeholder");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("mybusinessservice");
    cy.get("textarea[name='description']").type("mydescription");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("stakeholder-a")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.pf4_table_select_mainRows()
      .eq(0)
      .should("contain", "mybusinessservice")
      .should("contain", "mydescription")
      .should("contain", "stakeholder-a");
  });
});
