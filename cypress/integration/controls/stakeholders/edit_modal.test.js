/// <reference types="cypress" />

describe("Edit stakeholder", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    const stakeholders = [];

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
        })

        .log("Create job functions")
        .then(() => {
          return [
            {
              role: "Business Analyst",
            },
            {
              role: "Consultant",
            },
            {
              role: "DBA",
            },
          ].forEach((payload) => {
            cy.createJobFunction(payload, tokens);
          });
        });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder*").as("getStakeholdersApi");
    cy.intercept("PUT", "/api/controls/stakeholder/*").as(
      "updateStakeholderApi"
    );

    // Go to page
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

    cy.wait("@updateStakeholderApi");
    cy.wait("@getStakeholdersApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newEmail@domain.com")
      .should("contain", "newDisplayName");
  });

  it("Job function", () => {
    cy.intercept("GET", "/api/controls/job-function*").as("getJobFunctionsApi");

    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();
    cy.wait("@getJobFunctionsApi");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("Business Analyst")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateStakeholderApi");
    cy.wait("@getStakeholdersApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "Business Analyst");

    //

    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();
    cy.wait("@getJobFunctionsApi");

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

    cy.wait("@updateStakeholderApi");
    cy.wait("@getStakeholdersApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "Consultant");
  });

  // TODO test not working and should be uncommented
  // once https://github.com/konveyor/tackle-controls/issues/66 is resolved
  // it("Group", () => {
  //   cy.intercept("GET", "/api/controls/stakeholder-group*").as("getStakeholderGroupsApi");

  //   // Open modal
  //   cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
  //     .first()
  //     .click();
  //   cy.wait("@getStakeholderGroupsApi");

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

  //   cy.wait("@updateStakeholderApi");
  //   cy.wait("@getStakeholdersApi");

  //   // Verify table
  //   cy.get(".pf-c-table").pf4_table_rows().eq(0).should("contain", "2");
  // });
});
