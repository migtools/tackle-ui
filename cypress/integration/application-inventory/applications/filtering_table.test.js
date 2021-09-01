/// <reference types="cypress" />

describe("Application filtering table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean app inventory
    cy.get("@tokens").then((tokens) => {
      cy.tackleAppInventoryClean(tokens);
      cy.tackleControlsClean(tokens);
    });

    // Create data
    const businessServices = [];

    const tagTypes = [];
    const tags = [];

    cy.get("@tokens").then((tokens) => {
      cy.log("Create business services").then(() => {
        return [...Array(11)]
          .map((_, i) => ({
            name: `service-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createBusinessService(payload, tokens).then((data) => {
              businessServices.push(data);
            });
          });
      });

      cy.log("Create tagTypes").then(() => {
        return [...Array(6)]
          .map((_, i) => ({
            name: `tagType-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createTagType(payload, tokens).then((data) => {
              tagTypes.push(data);
            });
          });
      });
      cy.log("Create tags")
        .then(() => {
          return [...Array(6)]
            .map((_, i) => [
              {
                name: `tag-${(i + 10).toString(36)}-1`,
                tagType: tagTypes[i],
              },
              {
                name: `tag-${(i + 10).toString(36)}-2`,
                tagType: tagTypes[i],
              },
            ])
            .flatMap((a) => a)
            .forEach((payload) => {
              cy.createTag(payload, tokens).then((data) => {
                tags.push(data);
              });
            });
        })

        .log("Create applications")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              name: `application-${(i + 10).toString(36)}`,
              description: `description-${(i + 10).toString(36)}`,
              businessService: businessServices[i].id,
              tags: [tags[i].id],
            }))
            .forEach((payload) => {
              cy.createApplication(payload, tokens);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Inteceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplicationsApi"
    );

    cy.intercept("GET", "/api/controls/business-service?*").as(
      "getBusinessServicesApi"
    );
    cy.intercept("GET", "/api/controls/business-service/*").as(
      "getBusinessServiceApi"
    );

    cy.intercept("GET", "/api/controls/tag-type?*").as("getTagTypesApi");
    cy.intercept("GET", "/api/controls/tag/*").as("getTagApi");

    // Go to page
    cy.visit("/application-inventory");
  });

  it("By name", () => {
    // First filter
    cy.wait("@getApplicationsApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("application-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getApplicationsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");

    // Second filter

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("application-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getApplicationsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("application-k");
  });

  it("By description", () => {
    cy.get(".pf-c-toolbar .pf-c-dropdown").eq(0).pf4_dropdown("toggle");
    cy.get(".pf-c-toolbar .pf-c-dropdown")
      .eq(0)
      .pf4_dropdown("select", 1)
      .click();

    // First filter
    cy.wait("@getApplicationsApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("description-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getApplicationsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");

    // Second filter
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("description-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getApplicationsApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("description-k");
  });

  it("By business service", () => {
    cy.get(".pf-c-toolbar .pf-c-dropdown").eq(0).pf4_dropdown("toggle");
    cy.get(".pf-c-toolbar .pf-c-dropdown").eq(0).pf4_dropdown("select", 2).click();

    // First filter
    cy.wait("@getApplicationsApi");
    cy.wait("@getBusinessServicesApi");

    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__toggle > button"
    ).click();
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-search > input"
    ).type("service-a");
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-item > input"
    ).check();

    cy.wait("@getApplicationsApi");
    cy.wait("@getBusinessServiceApi"); // Wait for businessService inside row
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-a");

    // Second filter
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-search > input"
    )
      .clear()
      .type("service-k");
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-item > input"
    ).check();

    cy.wait("@getApplicationsApi");
    cy.wait("@getBusinessServiceApi"); // Wait for businessService inside row
    cy.wait("@getBusinessServiceApi"); // Wait for businessService inside row
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("service-k");
  });

  it("By tags", () => {
    cy.get(".pf-c-toolbar .pf-c-dropdown").eq(0).pf4_dropdown("toggle");
    cy.get(".pf-c-toolbar .pf-c-dropdown").eq(0).pf4_dropdown("select", 3).click();

    // First filter
    cy.wait("@getApplicationsApi");
    cy.wait("@getTagTypesApi");

    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__toggle > .pf-c-select__toggle-button"
    ).click();
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-search > input"
    ).type("tag-a-1");
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-item > input"
    ).check();

    cy.wait("@getApplicationsApi");
    cy.wait("@getTagApi"); // Wait for tag inside row

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-label")
      .should("contain", "tag-a-1");

    // Second filter
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__toggle > .pf-c-select__toggle-button"
    ).click();
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-search > input"
    ).type("tag-a-2");
    cy.get(
      ".pf-c-toolbar .pf-c-select > .pf-c-select__menu > .pf-c-form__fieldset > .pf-c-select__menu-item > input"
    ).check();

    cy.wait("@getApplicationsApi");
    cy.wait("@getTagApi"); // Wait for tag1 inside row
    cy.wait("@getTagApi"); // Wait for tag2 inside row

    cy.get(".pf-c-table").pf4_table_row_expand(1);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .eq(1)
      .find(".pf-c-label")
      .should("contain", "tag-a-2");
  });
});
