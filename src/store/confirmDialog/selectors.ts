import { RootState } from "../rootReducer";
import { stateKey } from "./reducer";

export const confirmDialogState = (state: RootState) => state[stateKey];

export const isProcessing = (state: RootState) =>
  confirmDialogState(state).isProcessing;

export const isOpen = (state: RootState) => confirmDialogState(state).isOpen;

export const title = (state: RootState) => confirmDialogState(state).title;
export const titleIconVariant = (state: RootState) =>
  confirmDialogState(state).titleIconVariant;
export const message = (state: RootState) => confirmDialogState(state).message;
export const confirmBtnLabel = (state: RootState) =>
  confirmDialogState(state).confirmBtnLabel;
export const cancelBtnLabel = (state: RootState) =>
  confirmDialogState(state).cancelBtnLabel;
export const variant = (state: RootState) => confirmDialogState(state).variant;

export const onConfirm = (state: RootState) =>
  confirmDialogState(state).onConfirm;
