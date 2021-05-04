import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { deleteTagType } from "api/rest";
import { TagType } from "api/models";

export interface IState {
  isDeleting: boolean;
  deleteTagType: (
    tagType: TagType,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useDeleteTagType = (): IState => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTagTypeHandler = useCallback(
    (
      tagType: TagType,
      onSuccess: () => void,
      onError: (error: AxiosError) => void
    ) => {
      if (!tagType.id) {
        throw new Error("Entity must have 'id' to execute this operation");
      }

      setIsDeleting(true);
      deleteTagType(tagType.id)
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
    deleteTagType: deleteTagTypeHandler,
  };
};

export default useDeleteTagType;
