import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { deleteTag } from "api/rest";
import { Tag } from "api/models";

export interface IState {
  isDeleting: boolean;
  deleteTag: (
    tag: Tag,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useDeleteTag = (): IState => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTagHandler = useCallback(
    (tag: Tag, onSuccess: () => void, onError: (error: AxiosError) => void) => {
      if (!tag.id) {
        throw new Error("Entity must have 'id' to execute this operation");
      }

      setIsDeleting(true);
      deleteTag(tag.id)
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
    deleteTag: deleteTagHandler,
  };
};

export default useDeleteTag;
