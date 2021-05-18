import {
  applyFilterTextToolbar,
  submitForm,
  verifyInitialFormStatus,
} from "./commons";

export interface IFormValue {
  name?: string;
  description?: string;
  businessService?: string;
  tags?: string[];
  comments?: string;
}

export class Application {
  openPage(): void {
    cy.visit("/application-inventory");

    // Interceptors for table
    cy.intercept("GET", "/api/controls/business-service*").as(
      "getAllBusinessServicesDropdown"
    );
    cy.intercept("GET", "/api/controls/tag-type*").as("getAllTagTypesDropdown");

    // Interceptors for managing dependencies
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getAllApplication_manageDependencies"
    );
    cy.intercept(
      "GET",
      "/api/application-inventory/applications-dependency*"
    ).as("getAllDependencies_manageDependencies");
    cy.intercept(
      "POST",
      "/api/application-inventory/applications-dependency"
    ).as("postDependency_manageDependencies");
    cy.intercept(
      "DELETE",
      "/api/application-inventory/applications-dependency/*"
    ).as("deleteDependency_manageDependencies");

    // Interceptors for assessment action
    cy.intercept("GET", "/api/pathfinder/assessments**").as(
      "getAssessmentsForApplication_assessment"
    );
  }

  protected fillForm(formValue: IFormValue): void {
    if (formValue.name) {
      cy.get("input[name='name']").clear().type(formValue.name);
    }
    if (formValue.description) {
      cy.get("input[name='description']").clear().type(formValue.description);
    }
    if (formValue.businessService) {
      cy.wait("@getAllBusinessServicesDropdown");
      cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
        .eq(0)
        .type(formValue.businessService)
        .type("{enter}");
    }
    if (formValue.tags) {
      cy.wait("@getAllTagTypesDropdown");
      formValue.tags.forEach((e) => {
        cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
          .eq(1)
          .type(e)
          .type("{enter}");
      });
    }
    if (formValue.comments) {
      cy.get("textarea[name='comments']").type(formValue.comments);
    }
  }

  create(formValue: IFormValue): void {
    this.openPage();

    cy.get("button[aria-label='create-application']").click();

    verifyInitialFormStatus();
    this.fillForm(formValue);
    submitForm();
  }

  edit(rowIndex: number, formValue: IFormValue): void {
    this.openPage();

    cy.get(".pf-c-table").pf4_table_row_edit(rowIndex, "open");

    verifyInitialFormStatus();
    this.fillForm(formValue);
    submitForm();
  }

  delete(rowIndex: number): void {
    this.openPage();

    cy.get(".pf-c-table").pf4_table_action_select(rowIndex, "Delete");
    cy.get("button[aria-label='confirm']").click();
  }

  applyFilter(filterIndex: number, filterText: string): void {
    applyFilterTextToolbar(filterIndex, filterText);
  }

  manageDependencies(
    rowIndex: number,
    { northToAdd, southToAdd }: { northToAdd: string[]; southToAdd: string[] },
    {
      northToDelete,
      southToDelete,
    }: { northToDelete: string[]; southToDelete: string[] } = {
      northToDelete: [],
      southToDelete: [],
    }
  ): void {
    this.openPage();

    cy.get(".pf-c-table").pf4_table_action_select(
      rowIndex,
      "Manage dependencies"
    );
    cy.wait("@getAllApplication_manageDependencies");
    cy.wait("@getAllDependencies_manageDependencies"); // Northbound dependencies
    cy.wait("@getAllDependencies_manageDependencies"); // Southbound dependencies

    // Adding dependencies
    northToAdd.forEach((e) => {
      cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
        .eq(0)
        .type(e)
        .type("{enter}");
      cy.wait("@postDependency_manageDependencies");
    });

    southToAdd.forEach((e) => {
      cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
        .eq(1)
        .type(e)
        .type("{enter}");
      cy.wait("@postDependency_manageDependencies");
    });

    // Removing dependencies
    northToDelete.forEach((e) => {
      cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
        .eq(0)
        .type(e)
        .type("{enter}");
      cy.wait("@deleteDependency_manageDependencies");
    });
    southToDelete.forEach((e) => {
      cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
        .eq(1)
        .type(e)
        .type("{enter}");
      cy.wait("@deleteDependency_manageDependencies");
    });
  }

  assessApplication(rowIndex: number): void {
    this.openPage();

    cy.get(".pf-c-table").pf4_table_row_check(rowIndex);
    cy.get(".pf-c-toolbar button[aria-label='assess-application']").click();

    cy.wait("@getAssessmentsForApplication_assessment")
  }
}
