import {
  applyFilterTextToolbar,
  submitForm,
  verifyInitialFormStatus,
} from "./commons";

export interface IFormValue {
  name: string;
  description?: string;
  members?: string[];
}

export class StakeholderGroup {
  openPage(): void {
    cy.visit("/controls/stakeholder-groups");

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder*").as(
      "getAllStakeholdersDropdown"
    );
  }

  protected fillForm(formValue: IFormValue): void {
    cy.get("input[name='name']").clear().type(formValue.name);

    if (formValue.description) {
      cy.get("textarea[name='description']")
        .clear()
        .type(formValue.description);
    }
    if (formValue.members) {
      cy.wait("@getAllStakeholdersDropdown");
      formValue.members.forEach((e) => {
        cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
          .eq(0)
          .type(e)
          .type("{enter}");
      });
    }
  }

  create(formValue: IFormValue): void {
    this.openPage();

    cy.get("button[aria-label='create-stakeholder-group']").click();

    verifyInitialFormStatus();
    this.fillForm(formValue);
    submitForm();
  }

  edit(rowIndex: number, formValue: IFormValue): void {
    this.openPage();

    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(rowIndex)
      .find("button[aria-label='edit']")
      .click();

    verifyInitialFormStatus();
    this.fillForm(formValue);
    submitForm();
  }

  delete(rowIndex: number): void {
    this.openPage();

    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(rowIndex)
      .find("button[aria-label='delete']")
      .click();
    cy.get("button[aria-label='confirm']").click();
  }

  applyFilter(filterIndex: number, filterText: string): void {
    applyFilterTextToolbar(filterIndex, filterText);
  }
}
