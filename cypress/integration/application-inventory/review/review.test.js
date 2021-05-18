/// <reference types="cypress" />

describe("Review", () => {
  // Global access to use it on brower URL
  let applicationWithAssessment1;
  let assessment1;

  let applicationWithoutAssessment;

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean app inventory
    cy.get("@tokens").then((tokens) => cy.tackleAppInventoryClean(tokens));

    // Create application1
    cy.get("@tokens").then((tokens) => {
      cy.log("Create applications").then(() => {
        cy.createApplication({ name: "application-1" }, tokens).then((data) => {
          applicationWithAssessment1 = data;
        });
      });
    });

    // Create application2
    cy.get("@tokens").then((tokens) => {
      cy.log("Create applications").then(() => {
        cy.createApplication({ name: "application-2" }, tokens).then((data) => {
          applicationWithoutAssessment = data;
        });
      });
    });

    // Create assessment
    cy.get("@tokens").then((tokens) => {
      cy.deleteAssessmentByApplicationId(applicationWithAssessment1.id, tokens);
      cy.createAssessment(
        {
          applicationId: applicationWithAssessment1.id,
        },
        tokens
      ).then((data) => {
        assessment1 = data;
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Interceptors
    cy.intercept("GET", "/api/pathfinder/assessments*").as("getAssessmentsApi");
    cy.intercept("GET", "/api/pathfinder/assessments/*").as("getAssessmentApi");
    cy.intercept("PATCH", "/api/pathfinder/assessments/*").as(
      "patchAssessmentApi"
    );

    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplicationsApi"
    );
    cy.intercept("GET", "/api/application-inventory/application/*").as(
      "getApplicationApi"
    );
    cy.intercept("POST", "/api/application-inventory/review").as(
      "postReviewApi"
    );
  });

  it("Go to review page when application doesn't exists", () => {
    // Go to page
    cy.visit("/application-inventory/application/123456789/review");
    cy.wait("@getApplicationApi");

    cy.get(".pf-c-title").contains("Not available");
  });

  it("Go to review page when application doesn't have assessment", () => {
    // Go to page
    cy.visit(
      `/application-inventory/application/${applicationWithoutAssessment.id}/review`
    );
    cy.wait("@getApplicationApi");

    cy.get(".pf-c-title").contains("Assessment has not been completed");
  });

  it("Answer questionnaire and then create a review", () => {
    // Go to page
    cy.visit("/application-inventory/assessment/" + assessment1.id);

    // First step
    cy.get(".pf-c-wizard__footer button[cy-data='back']").should("be.disabled");
    cy.get(".pf-c-wizard__footer").find("button[cy-data='next']").click();

    // Category 1
    for (let i = 0; i < 5; i++) {
      cy.get(".pf-c-wizard__footer button[cy-data='next']").should(
        "be.disabled"
      );

      cy.get("div[cy-data='question']").each((question) => {
        cy.wrap(question).find("input[type='radio']").eq(i).check();
      });

      cy.get(".pf-c-wizard__footer button[cy-data='next']").should(
        "not.be.disabled"
      );

      if (i < 4) {
        cy.get(".pf-c-wizard__footer").find("button[cy-data='next']").click();
      } else {
        cy.get(".pf-c-wizard__footer")
          .find("button[cy-data='save-and-review']")
          .click();
      }
    }

    cy.wait("@patchAssessmentApi");
    cy.wait("@getApplicationApi");
    cy.wait(500);

    // Verify initial conditions after redirect
    cy.url().should(
      "match",
      new RegExp("/application-inventory/application/.*/review")
    );

    cy.wait("@getApplicationApi");
    cy.wait("@getAssessmentsApi");
    cy.wait("@getAssessmentApi");
    cy.get("button[aria-label='submit']").should("be.disabled");

    /**
     * Test donut chart
     */
    cy.get(".pf-c-chart").should("have.length", 1);

    /**
     * Test table
     */

    // Sort by risk Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Risk");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("Green");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("Amber");

    // Sort by risk Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Risk");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("Unknown");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("Red");

    // Filter by risk
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__toggle > button"
    ).click();
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-search > input"
    ).type("Green");
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-item > input"
    ).check();
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("Green");

    cy.get("button.pf-m-link")
      .contains("Clear all filters")
      .click({ force: true });

    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__toggle > button"
    ).click();
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-search > input"
    ).type("Red");
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-item > input"
    ).check();
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("Red");

    /**
     * Test form
     */
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("rehost")
      .type("{enter}");
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("large")
      .type("{enter}");
    cy.get("input[aria-label='criticality']").clear().type(3);
    cy.get("input[aria-label='priority']").clear().type(5);

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    // verify
    cy.wait("@postReviewApi");

    cy.wait(500);
    cy.wait("@getApplicationsApi");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .find("td[data-label='Review']")
      .contains("Completed");
  });
});
