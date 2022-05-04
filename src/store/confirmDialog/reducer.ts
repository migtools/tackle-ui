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
import { ButtonVariant } from "@patternfly/react-core";
import { ActionType, getType } from "typesafe-actions";
import { closeDialog, openDialog, processing } from "./actions";

export const stateKey = "confirmDialog";

export type ConfirmDialogState = Readonly<{
  isOpen: boolean;
  isProcessing: boolean;

  title: string;
  titleIconVariant?:
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "default"
    | React.ComponentType<any>;
  message: string | React.ReactNode;
  confirmBtnLabel: string;
  cancelBtnLabel: string;
  confirmBtnVariant: ButtonVariant;

  onConfirm: () => void;
}>;

export const defaultState: ConfirmDialogState = {
  isOpen: false,
  isProcessing: false,

  title: "",
  titleIconVariant: undefined,
  message: "",
  confirmBtnLabel: "Confirm",
  cancelBtnLabel: "Cancel",
  confirmBtnVariant: ButtonVariant.primary,

  onConfirm: () => {},
};

export type ConfirmDialogAction = ActionType<
  typeof openDialog | typeof closeDialog | typeof processing
>;

export const reducer = (
  state: ConfirmDialogState = defaultState,
  action: ConfirmDialogAction
): ConfirmDialogState => {
  switch (action.type) {
    case getType(openDialog):
      return {
        ...state,
        ...action.payload,
        isOpen: true,
      };
    case getType(processing):
      return {
        ...state,
        isProcessing: true,
      };
    case getType(closeDialog):
      return defaultState;
    default:
      return state;
  }
};
