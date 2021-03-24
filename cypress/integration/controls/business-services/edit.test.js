/// <reference types="cypress" />

describe("Edit business service", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    const stakeholders = [];

    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));
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

    cy.intercept({
      method: "GET",
      path: `/api/controls/business-service*`,
    }).as("getTableDataApi");
    cy.intercept({
      method: "PUT",
      path: `/api/controls/business-service/*`,
    }).as("updateDataApi");

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

    cy.wait("@updateDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.pf4_table_select_mainRows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "newDescription");
  });

  it("Owner", () => {
    cy.intercept({
      method: "GET",
      path: "/api/controls/stakeholder*",
    }).as("apiCheckGetStakeholders");

    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();
    cy.wait("@apiCheckGetStakeholders");

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

    cy.wait("@updateDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.pf4_table_select_mainRows().eq(0).should("contain", "stakeholder-b");
  });
});
