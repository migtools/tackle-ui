/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from "react";
import { mount } from "enzyme";
import { CustomWizardFooter } from "../custom-wizard-footer";

describe("AppPlaceholder", () => {
  it("First step: should use 'next' label and 'back' be disabled", () => {
    const wrapper = mount(
      <CustomWizardFooter
        isFirstStep={true}
        isLastStep={false}
        isDisabled={false}
        isFormInvalid={false}
        onSave={jest.fn()}
        onSaveAsDraft={jest.fn()}
      />
    );

    expect(wrapper.find("button[cy-data='next']").text()).toBe("actions.next");
    expect(wrapper.find("button[cy-data='back']")).toBeDisabled();
  });

  it("Last step: should use 'save' label", () => {
    const wrapper = mount(
      <CustomWizardFooter
        isFirstStep={false}
        isLastStep={true}
        isDisabled={false}
        isFormInvalid={false}
        onSave={jest.fn()}
        onSaveAsDraft={jest.fn()}
      />
    );

    expect(wrapper.find("button[cy-data='next']").text()).toBe("actions.save");
  });

  it("Last step: should have 'saveAndReview' button", () => {
    const wrapper = mount(
      <CustomWizardFooter
        isFirstStep={false}
        isLastStep={true}
        isDisabled={false}
        isFormInvalid={false}
        onSave={jest.fn()}
        onSaveAsDraft={jest.fn()}
      />
    );

    expect(wrapper.find("button[cy-data='save-and-review']").text()).toBe(
      "actions.saveAndReview"
    );
  });

  it("Disable all using 'isDisabled=true'", () => {
    const wrapper = mount(
      <CustomWizardFooter
        isFirstStep={false}
        isLastStep={false}
        isDisabled={true}
        isFormInvalid={false}
        onSave={jest.fn()}
        onSaveAsDraft={jest.fn()}
      />
    );

    expect(wrapper.find("button[cy-data='next']")).toBeDisabled();
    expect(wrapper.find("button[cy-data='back']")).toBeDisabled();
    expect(wrapper.find("button[cy-data='cancel']")).toBeDisabled();
    expect(wrapper.find("button[cy-data='save-as-draft']")).toBeDisabled();
  });

  it("Disable actions using 'isFormInvalid=true'", () => {
    const wrapper = mount(
      <CustomWizardFooter
        isFirstStep={false}
        isLastStep={false}
        isDisabled={false}
        isFormInvalid={true}
        onSave={jest.fn()}
        onSaveAsDraft={jest.fn()}
      />
    );

    expect(wrapper.find("button[cy-data='next']")).toBeDisabled();
    expect(wrapper.find("button[cy-data='back']")).toBeDisabled();
    expect(wrapper.find("button[cy-data='cancel']")).not.toBeDisabled();
    expect(wrapper.find("button[cy-data='save-as-draft']")).toBeDisabled();
  });

  it("Last step: should call 'onSave' callback", () => {
    const onSaveSpy = jest.fn();

    const wrapper = mount(
      <CustomWizardFooter
        isFirstStep={false}
        isLastStep={true}
        isDisabled={false}
        isFormInvalid={false}
        onSave={onSaveSpy}
        onSaveAsDraft={jest.fn()}
      />
    );

    wrapper.find("button[cy-data='next']").simulate("click");
    expect(onSaveSpy).toHaveBeenCalledTimes(1);
  });

  it("On step: should call 'saveAsDraft' callback", () => {
    const onSaveAsDraftSpy = jest.fn();

    const wrapper = mount(
      <CustomWizardFooter
        isFirstStep={false}
        isLastStep={false}
        isDisabled={false}
        isFormInvalid={false}
        onSave={jest.fn()}
        onSaveAsDraft={onSaveAsDraftSpy}
      />
    );

    wrapper.find("button[cy-data='save-as-draft']").simulate("click");
    expect(onSaveAsDraftSpy).toHaveBeenCalledTimes(1);
  });
});
