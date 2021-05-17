import {
  applyFilterTextToolbar,
  submitForm,
  verifyInitialFormStatus,
} from "./commons";

export interface IFormValue {
  name: string;
  tagType?: string;
}

export class Tag {
  openPage(): void {
    cy.visit("/controls/tags");

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder*").as(
      "getAllStakeholdersDropdown"
    );
  }

  protected fillForm(formValue: IFormValue): void {
    cy.get("input[name='name']").clear().type(formValue.name);

    if (formValue.tagType) {
      cy.get(".pf-c-form__group-control button.pf-c-select__toggle-button")
        .eq(0)
        .click();
      cy.get(".pf-c-select.pf-m-expanded > ul > li > button")
        .contains(formValue.tagType)
        .click();
    }
  }

  create(formValue: IFormValue): void {
    this.openPage();

    cy.get("button[aria-label='create-tag']").click();

    verifyInitialFormStatus();
    this.fillForm(formValue);
    submitForm();
  }

  edit(
    tagTypeRowIndex: number,
    tagRowIndex: number,
    formValue: IFormValue
  ): void {
    this.openPage();

    cy.get(".pf-c-table").pf4_table_row_expand(tagTypeRowIndex);
    cy.get(
      ".pf-c-table__expandable-row-content > div > .pf-c-table"
    ).pf4_table_action_select(tagRowIndex, "Edit");

    verifyInitialFormStatus();
    this.fillForm(formValue);
    submitForm();
  }

  delete(tagTypeRowIndex: number, tagRowIndex: number): void {
    this.openPage();

    cy.get(".pf-c-table").pf4_table_row_expand(tagTypeRowIndex);
    cy.get(
      ".pf-c-table__expandable-row-content > div > .pf-c-table"
    ).pf4_table_action_select(tagRowIndex, "Delete");

    cy.get("button[aria-label='confirm']").click();
  }
}
