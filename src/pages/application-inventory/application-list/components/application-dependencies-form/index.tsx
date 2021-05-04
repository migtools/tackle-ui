import React from "react";
import { FormContextProvider } from "./form-context";
import {
  ApplicationDependenciesFormProps,
  ApplicationDependenciesForm,
} from "./application-dependencies-form";

const Form: React.FC<ApplicationDependenciesFormProps> = ({ ...props }) => {
  return (
    <FormContextProvider>
      <ApplicationDependenciesForm {...props} />
    </FormContextProvider>
  );
};

export default Form;
