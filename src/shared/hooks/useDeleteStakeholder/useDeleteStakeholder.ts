import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { deleteStakeholder } from "api/rest";
import { Stakeholder } from "api/models";

export interface IState {
  isDeleting: boolean;
  deleteStakeholder: (
    stakeholder: Stakeholder,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useDeleteStakeholder = (): IState => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteStakeholderHandler = useCallback(
    (
      stakeholder: Stakeholder,
      onSuccess: () => void,
      onError: (error: AxiosError) => void
    ) => {
      if (!stakeholder.id) {
        throw new Error("Stakeholder must have 'id' to execute this operation");
      }

      setIsDeleting(true);
      deleteStakeholder(stakeholder.id)
        .then(() => {
          setIsDeleting(false);
          onSuccess();
        })
        .catch((error: AxiosError) => {
          setIsDeleting(false);
          onError(error);
        });
    },
    []
  );

  return {
    isDeleting,
    deleteStakeholder: deleteStakeholderHandler,
  };
};

export default useDeleteStakeholder;
