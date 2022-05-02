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
import React from "react";
import { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";

import { Modal, ModalVariant } from "@patternfly/react-core";

import { TagType } from "api/models";

import { TagTypeForm } from "../tag-type-form";

export interface NewTagTypeModalProps {
  isOpen: boolean;
  onSaved: (response: AxiosResponse<TagType>) => void;
  onCancel: () => void;
}

export const NewTagTypeModal: React.FC<NewTagTypeModalProps> = ({
  isOpen,
  onSaved,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("dialog.title.newTagType")}
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onCancel}
    >
      <TagTypeForm onSaved={onSaved} onCancel={onCancel} />
    </Modal>
  );
};
