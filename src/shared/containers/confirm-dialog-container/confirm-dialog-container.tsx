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

  const title = useSelector((state: RootState) =>
    confirmDialogSelectors.title(state)
  );
  const titleIconVariant = useSelector((state: RootState) =>
    confirmDialogSelectors.titleIconVariant(state)
  );
  const message = useSelector((state: RootState) =>
    confirmDialogSelectors.message(state)
  );
  const confirmBtnLabel = useSelector((state: RootState) =>
    confirmDialogSelectors.confirmBtnLabel(state)
  );
  const cancelBtnLabel = useSelector((state: RootState) =>
    confirmDialogSelectors.cancelBtnLabel(state)
  );
  const variant = useSelector((state: RootState) =>
    confirmDialogSelectors.variant(state)
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
      title={title}
      titleIconVariant={titleIconVariant}
      message={message}
      inProgress={isProcessing}
      onClose={onCancel}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmBtnLabel={confirmBtnLabel}
      cancelBtnLabel={cancelBtnLabel}
      variant={variant}
    />
  );
};
