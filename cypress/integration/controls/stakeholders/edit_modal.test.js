/// <reference types="cypress" />

describe("Edit stakeholder", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    const stakeholders = [];

    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));
    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholder groups")
        .then(() => {
          return [...Array(5)]
            .map((_, i) => ({
              name: `group-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.createStakeholderGroup(payload, tokens).then((data) => {
                stakeholders.push(data);
              });
            });
        })

        .log("Create stakeholder")
        .then(() => {
          const payload = {
            email: `email-a@domain.com`,
            displayName: `stakeholder-a`,
            stakeholderGroups: stakeholders.slice(0, 1),
          };
          cy.createStakeholder(payload, tokens);
        });
    });

    cy.intercept({
      method: "GET",
      path: `/api/controls/stakeholder*`,
    }).as("getTableDataApi");
    cy.intercept({
      method: "PUT",
      path: `/api/controls/stakeholder/*`,
    }).as("updateDataApi");

    cy.visit("/controls/stakeholders");
  });

  it("Email and displayName", () => {
    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='email']").clear().type("newEmail@domain.com");
    cy.get("input[name='displayName']").clear().type("newDisplayName");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.pf4_table_select_mainRows()
      .eq(0)
      .should("contain", "newEmail@domain.com")
      .should("contain", "newDisplayName");
  });

  it("Job function", () => {
    cy.intercept({
      method: "GET",
      path: "/api/controls/job-function*",
    }).as("apiCheckGetJobFunction");

    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();
    cy.wait("@apiCheckGetJobFunction");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("Business Analyst")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.pf4_table_select_mainRows().eq(0).should("contain", "Business Analyst");

    //

    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();
    cy.wait("@apiCheckGetJobFunction");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .clear()
      .type("Consultant")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.pf4_table_select_mainRows().eq(0).should("contain", "Consultant");
  });

  // TODO test not working and should be uncommented
  // once https://github.com/konveyor/tackle-controls/issues/66 is resolved
  // it("Group", () => {
  //   cy.intercept({
  //     method: "GET",
  //     path: "/api/controls/stakeholder-group*",
  //   }).as("apiCheckGetStakeholderGroup");

  //   // Open modal
  //   cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
  //     .first()
  //     .click();
  //   cy.wait("@apiCheckGetStakeholderGroup");

  //   // Verify primary button is disabled
  //   cy.get("button[aria-label='submit']").should("be.disabled");

  //   // Clean groups
  //   cy.get(
  //     ".pf-c-form__group-control .pf-m-typeahead button[aria-label='Clear all']"
  //   )
  //     .first()
  //     .click();

  //   // Fill form
  //   cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
  //     .eq(1)
  //     .type("group-b")
  //     .type("{enter}");
  //   cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
  //     .eq(1)
  //     .type("group-c")
  //     .type("{enter}");

  //   cy.get("button[aria-label='submit']").should("not.be.disabled");
  //   cy.get("form").submit();

  //   cy.wait("@updateDataApi");
  //   cy.wait("@getTableDataApi");

  //   // Verify table
  //   cy.pf4_table_select_mainRows().eq(0).should("contain", "2");
  // });
});
