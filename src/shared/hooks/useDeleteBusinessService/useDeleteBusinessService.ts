import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { deleteBusinessService } from "api/rest";
import { BusinessService } from "api/models";

export interface IState {
  isDeleting: boolean;
  deleteBusinessService: (
    businessService: BusinessService,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useDeleteBusinessService = (): IState => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteBusinessServiceHandler = useCallback(
    (
      businessService: BusinessService,
      onSuccess: () => void,
      onError: (error: AxiosError) => void
    ) => {
      if (!businessService.id) {
        throw new Error(
          "BusinessService must have 'id' to execute this operation"
        );
      }

      setIsDeleting(true);
      deleteBusinessService(businessService.id)
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
    deleteBusinessService: deleteBusinessServiceHandler,
  };
};

export default useDeleteBusinessService;
