import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { deleteApplication } from "api/rest";
import { Application } from "api/models";

export interface IState {
  isDeleting: boolean;
  deleteApplication: (
    application: Application,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useDeleteApplication = (): IState => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteApplicationHandler = useCallback(
    (
      application: Application,
      onSuccess: () => void,
      onError: (error: AxiosError) => void
    ) => {
      if (!application.id) {
        throw new Error(
          "BusinessService must have 'id' to execute this operation"
        );
      }

      setIsDeleting(true);
      deleteApplication(application.id)
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
    deleteApplication: deleteApplicationHandler,
  };
};

export default useDeleteApplication;
