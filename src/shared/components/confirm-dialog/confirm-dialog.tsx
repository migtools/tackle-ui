import React from "react";
import {
  Button,
  Modal,
  ButtonVariant,
  ModalVariant,
} from "@patternfly/react-core";

export interface ConfirmDialogProps {
  isOpen: boolean;

  title: string;
  message: string;

  confirmBtnLabel: string;
  cancelBtnLabel: string;

  inProgress?: boolean;
  variant: ButtonVariant;

  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmBtnLabel,
  cancelBtnLabel,
  inProgress,
  variant,
  onClose,
  onConfirm,
  onCancel,
}) => {
  const confirmBtn = (
    <Button
      key="confirm"
      aria-label="confirm"
      variant={variant}
      isDisabled={inProgress}
      onClick={onConfirm}
    >
      {confirmBtnLabel}
    </Button>
  );

  const cancelBtn = onCancel ? (
    <Button
      key="cancel"
      aria-label="cancel"
      variant={ButtonVariant.link}
      isDisabled={inProgress}
      onClick={onCancel}
    >
      {cancelBtnLabel}
    </Button>
  ) : undefined;

  return (
    <Modal
      variant={ModalVariant.small}
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      aria-label="confirm-dialog"
      actions={onCancel ? [confirmBtn, cancelBtn] : [confirmBtn]}
    >
      {message}
    </Modal>
  );
};
