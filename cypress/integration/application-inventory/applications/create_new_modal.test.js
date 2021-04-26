/// <reference types="cypress" />

describe("Create new application", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean
    cy.get("@tokens").then((tokens) => {
      cy.tackleAppInventoryClean(tokens);
      cy.tackleControlsClean(tokens);
    });

    const tagTypes = [];

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create business services").then(() => {
        return [...Array(11)]
          .map((_, i) => ({
            name: `service-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createBusinessService(payload, tokens);
          });
      });

      cy.log("Create tagTypes").then(() => {
        return [...Array(2)]
          .map((_, i) => ({
            name: `tagType-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createTagType(payload, tokens).then((data) => {
              tagTypes.push(data);
            });
          });
      });
      cy.log("Create tags").then(() => {
        return [...Array(2)]
          .map((_, i) => [
            {
              name: `tag-a-${(i + 10).toString(36)}`,
              tagType: tagTypes[i],
            },
            {
              name: `tag-b-${(i + 10).toString(36)}`,
              tagType: tagTypes[i],
            },
          ])
          .flatMap((a) => a)
          .forEach((payload) => {
            cy.createTag(payload, tokens);
          });
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) =>
      cy.tackleControlsCleanApplications(tokens)
    );

    // Interceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplicationsApi"
    );
    cy.intercept("POST", "/api/application-inventory/application*").as(
      "createApplicationApi"
    );

    // Go to page
    cy.visit("/application-inventory");
  });

  it("With min data", () => {
    // Open modal
    cy.get("button[aria-label='create-application']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("myapplication");
    cy.get("input[name='description']").type("mydescription");
    cy.get("textarea[name='comments']").type("mycomments");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createApplicationApi");
    cy.wait("@getApplicationsApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myapplication")
      .should("contain", "mydescription");
  });

  it("With business service", () => {
    cy.intercept("GET", new RegExp("/api/controls/business-service*")).as(
      "getBusinessServicesApi"
    );

    // Open modal
    cy.get("button[aria-label='create-application']").click();
    cy.wait("@getBusinessServicesApi");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("mybusinessservice");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("service-a")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createApplicationApi");
    cy.wait("@getApplicationsApi");
    cy.wait("@getBusinessServicesApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "mybusinessservice")
      .should("contain", "service-a");
  });

  it("With tags", () => {
    cy.intercept("GET", new RegExp("/api/controls/tag-type*")).as(
      "getTagTypesApi"
    );
    cy.intercept("GET", new RegExp("/api/controls/tag/*")).as("getTagApi");

    // Open modal
    cy.get("button[aria-label='create-application']").click();
    cy.wait("@getTagTypesApi");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("myapplication");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("tag-a-a")
      .type("{enter}");
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("tag-b-a")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createApplicationApi");
    cy.wait("@getApplicationsApi");
    cy.wait("@getTagApi"); // Fetch first tag
    cy.wait("@getTagApi"); // Fetch second tag

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myapplication")
      .should("contain", "2"); // 2 tags

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-label")
      .should("contain", "tag-a-a")
      .should("contain", "tag-b-a");
  });
});
