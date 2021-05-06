import React, { useEffect } from "react";
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

  useEffect(() => {
    console.log(modal);
  });
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
      variant={modal.variant}
    />
  );
};
