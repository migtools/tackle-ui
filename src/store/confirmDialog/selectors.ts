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
import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const confirmDialogState = (state: RootState) => state[stateKey];

export const isProcessing = (state: RootState) =>
  confirmDialogState(state).isProcessing;

export const isOpen = (state: RootState) => confirmDialogState(state).isOpen;

export const modal = (state: RootState) => ({
  title: confirmDialogState(state).title,
  titleIconVariant: confirmDialogState(state).titleIconVariant,
  message: confirmDialogState(state).message,
  confirmBtnLabel: confirmDialogState(state).confirmBtnLabel,
  cancelBtnLabel: confirmDialogState(state).cancelBtnLabel,
  confirmBtnVariant: confirmDialogState(state).confirmBtnVariant,
});

export const onConfirm = (state: RootState) =>
  confirmDialogState(state).onConfirm;
