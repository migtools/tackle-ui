/// <reference types="cypress" />

describe("Create new stakeholder", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholder groups").then(() => {
        return [...Array(11)]
          .map((_, i) => ({
            name: `group-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createStakeholderGroup(payload, tokens);
          });
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Delete all stakeholders
    cy.get("@tokens").then((tokens) =>
      cy.tackleControlsCleanStakeholders(tokens)
    );

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder*").as("getStakeholdersApi");
    cy.intercept("POST", "/api/controls/stakeholder*").as(
      "createStakeholderApi"
    );

    // Go to page
    cy.visit("/controls/stakeholders");
  });

  it("With min data", () => {
    // Open modal
    cy.get("button[aria-label='create-stakeholder']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='email']").type("aaa@domain.com");
    cy.get("input[name='displayName']").type("myDisplayName");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createStakeholderApi");
    cy.wait("@getStakeholdersApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa@domain.com")
      .should("contain", "myDisplayName");
  });

  it("With job function", () => {
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctionsApi");

    // Open modal
    cy.get("button[aria-label='create-stakeholder']").click();
    cy.wait("@getJobFunctionsApi");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='email']").type("aaa@domain.com");
    cy.get("input[name='displayName']").type("myDisplayName");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("Business Analyst")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createStakeholderApi");
    cy.wait("@getStakeholdersApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa@domain.com")
      .should("contain", "myDisplayName")
      .should("contain", "Business Analyst");
  });

  it("With group", () => {
    cy.intercept("GET", "/api/controls/stakeholder-group*").as(
      "getStakeholderGroupsApi"
    );

    // Open modal
    cy.get("button[aria-label='create-stakeholder']").click();
    cy.wait("@getStakeholderGroupsApi");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='email']").type("aaa@domain.com");
    cy.get("input[name='displayName']").type("myDisplayName");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("group-a")
      .type("{enter}");
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("group-b")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createStakeholderApi");
    cy.wait("@getStakeholdersApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa@domain.com")
      .should("contain", "myDisplayName")
      .should("contain", "2");
  });
});
