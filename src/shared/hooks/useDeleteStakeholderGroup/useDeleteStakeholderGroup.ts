import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { deleteStakeholderGroup } from "api/rest";
import { StakeholderGroup } from "api/models";

export interface IState {
  isDeleting: boolean;
  deleteStakeholderGroup: (
    stakeholder: StakeholderGroup,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useDeleteStakeholderGroup = (): IState => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteStakeholderGroupHandler = useCallback(
    (
      stakeholderGroup: StakeholderGroup,
      onSuccess: () => void,
      onError: (error: AxiosError) => void
    ) => {
      if (!stakeholderGroup.id) {
        throw new Error(
          "StakeholderGroup must have 'id' to execute this operation"
        );
      }

      setIsDeleting(true);
      deleteStakeholderGroup(stakeholderGroup.id)
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
    deleteStakeholderGroup: deleteStakeholderGroupHandler,
  };
};

export default useDeleteStakeholderGroup;
