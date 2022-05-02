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
import { createAction } from "typesafe-actions";

interface Item {
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
}

export const openDialog = createAction("dialog/confirm/open")<Item>();
export const closeDialog = createAction("dialog/confirm/close")<void>();
export const processing = createAction("dialog/confirm/processing")<void>();
