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

import { StakeholderGroup } from "api/models";

import { StakeholderGroupForm } from "../stakeholder-group-form";

export interface UpdateStakeholderGroupModalProps {
  stakeholderGroup?: StakeholderGroup;
  onSaved: (response: AxiosResponse<StakeholderGroup>) => void;
  onCancel: () => void;
}

export const UpdateStakeholderGroupModal: React.FC<UpdateStakeholderGroupModalProps> = ({
  stakeholderGroup,
  onSaved,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("dialog.title.updateStakeholderGroup")}
      variant={ModalVariant.medium}
      isOpen={!!stakeholderGroup}
      onClose={onCancel}
    >
      <StakeholderGroupForm
        stakeholderGroup={stakeholderGroup}
        onSaved={onSaved}
        onCancel={onCancel}
      />
    </Modal>
  );
};
