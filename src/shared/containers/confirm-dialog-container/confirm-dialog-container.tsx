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
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "store/rootReducer";

import { ConfirmDialog } from "shared/components";
import {
  confirmDialogActions,
  confirmDialogSelectors,
} from "store/confirmDialog";

export const ConfirmDialogContainer: React.FC = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) =>
    confirmDialogSelectors.isOpen(state)
  );
  const isProcessing = useSelector((state: RootState) =>
    confirmDialogSelectors.isProcessing(state)
  );

  const modal = useSelector((state: RootState) =>
    confirmDialogSelectors.modal(state)
  );

  const onConfirm = useSelector((state: RootState) =>
    confirmDialogSelectors.onConfirm(state)
  );

  const onCancel = () => {
    dispatch(confirmDialogActions.closeDialog());
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={modal.title}
      titleIconVariant={modal.titleIconVariant}
      message={modal.message}
      inProgress={isProcessing}
      onClose={onCancel}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmBtnLabel={modal.confirmBtnLabel}
      cancelBtnLabel={modal.cancelBtnLabel}
      confirmBtnVariant={modal.confirmBtnVariant}
    />
  );
};
