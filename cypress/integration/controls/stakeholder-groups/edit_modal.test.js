/// <reference types="cypress" />

describe("Edit stakeholder group", () => {
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

        .log("Create stakeholder group")
        .then(() => {
          const payload = {
            name: `group-a`,
            stakeholders: stakeholders.slice(0, 1),
          };
          return cy.createStakeholderGroup(payload, tokens);
        });
    });

    cy.intercept({
      method: "GET",
      path: `/api/controls/stakeholder-group*`,
    }).as("getTableDataApi");
    cy.intercept({
      method: "PUT",
      path: `/api/controls/stakeholder-group/*`,
    }).as("updateDataApi");

    cy.visit("/controls/stakeholder-groups");
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

  it("Members", () => {
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

    // Clean members
    cy.get(
      ".pf-c-form__group-control .pf-m-typeahead button[aria-label='Clear all']"
    )
      .first()
      .click();

    // Fill form
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("stakeholder-b")
      .type("{enter}");
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("stakeholder-c")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.pf4_table_select_mainRows().eq(0).should("contain", "2");
  });
});
