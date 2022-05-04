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

import { BusinessService } from "api/models";

import { BusinessServiceForm } from "../business-service-form";

export interface UpdateBusinessServiceModalProps {
  businessService?: BusinessService;
  onSaved: (response: AxiosResponse<BusinessService>) => void;
  onCancel: () => void;
}

export const UpdateBusinessServiceModal: React.FC<UpdateBusinessServiceModalProps> = ({
  businessService,
  onSaved,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("dialog.title.updateBusinessService")}
      variant={ModalVariant.medium}
      isOpen={!!businessService}
      onClose={onCancel}
    >
      <BusinessServiceForm
        businessService={businessService}
        onSaved={onSaved}
        onCancel={onCancel}
      />
    </Modal>
  );
};
