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
import React, { useCallback, useEffect } from "react";

import { useFetch } from "shared/hooks";

import { BusinessService } from "api/models";
import { getBusinessServiceById } from "api/rest";

export interface ApplicationBusinessServiceProps {
  id: number | string;
}

export const ApplicationBusinessService: React.FC<ApplicationBusinessServiceProps> = ({
  id,
}) => {
  const onFetchBusinessService = useCallback(() => {
    return getBusinessServiceById(id);
  }, [id]);

  const {
    data: businessService,
    fetchError,
    requestFetch: refreshBusinessService,
  } = useFetch<BusinessService>({
    defaultIsFetching: true,
    onFetch: onFetchBusinessService,
  });

  useEffect(() => {
    refreshBusinessService();
  }, [refreshBusinessService]);

  if (fetchError) {
    return <></>;
  }

  return <>{businessService?.name}</>;
};
