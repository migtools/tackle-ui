/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { useState } from "react";
import { AxiosError, AxiosPromise } from "axios";

export interface IArgs<T> {
  onDelete: (t: T) => AxiosPromise;
}

export interface IState<T> {
  isDeleting: boolean;
  requestDelete: (
    t: T,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useDelete = <T>({ onDelete }: IArgs<T>): IState<T> => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteHandler = (
    t: T,
    onSuccess: () => void,
    onError: (error: AxiosError) => void
  ) => {
    setIsDeleting(true);
    onDelete(t)
      .then(() => {
        setIsDeleting(false);
        onSuccess();
      })
      .catch((error: AxiosError) => {
        setIsDeleting(false);
        onError(error);
      });
  };

  return {
    isDeleting,
    requestDelete: deleteHandler,
  };
};

export default useDelete;
