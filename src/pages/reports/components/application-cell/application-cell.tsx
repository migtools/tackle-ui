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
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { EmptyTextMessage } from "shared/components";
import { Application } from "api/models";

export interface IApplicationCellProps {
  application?: Application;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchCount: number;
}

export const ApplicationCell: React.FC<IApplicationCellProps> = ({
  application,
  isFetching,
  fetchError,
  fetchCount,
}) => {
  const { t } = useTranslation();

  if (fetchError) {
    return <EmptyTextMessage message={t("terms.notAvailable")} />;
  }
  if (isFetching || fetchCount === 0) {
    return <></>;
  }

  return <>{application?.name}</>;
};
