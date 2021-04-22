import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { deleteJobFunction } from "api/rest";
import { JobFunction } from "api/models";

export interface IState {
  isDeleting: boolean;
  deleteJobFunction: (
    jobFunction: JobFunction,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useDeleteJobFunction = (): IState => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteHandler = useCallback(
    (
      tag: JobFunction,
      onSuccess: () => void,
      onError: (error: AxiosError) => void
    ) => {
      if (!tag.id) {
        throw new Error("Entity must have 'id' to execute this operation");
      }

      setIsDeleting(true);
      deleteJobFunction(tag.id)
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
    deleteJobFunction: deleteHandler,
  };
};

export default useDeleteJobFunction;
