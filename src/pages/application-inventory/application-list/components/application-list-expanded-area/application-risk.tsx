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

import { RiskLabel } from "shared/components";
import { useFetch } from "shared/hooks";

import { Application, AssessmentRisk } from "api/models";
import { getAssessmentLandscape } from "api/rest";

export interface IApplicationRiskProps {
  application: Application;
}

export const ApplicationRisk: React.FC<IApplicationRiskProps> = ({
  application,
}) => {
  // Risk
  const fetchRiskData = useCallback(() => {
    return getAssessmentLandscape([application.id!]).then(
      ({ data }) => data[0]
    );
  }, [application]);

  const {
    data: applicationRisk,
    requestFetch: fetchRisk,
  } = useFetch<AssessmentRisk>({
    defaultIsFetching: true,
    onFetchPromise: fetchRiskData,
  });

  useEffect(() => {
    fetchRisk();
  }, [fetchRisk, application]);

  return (
    <RiskLabel risk={applicationRisk ? applicationRisk.risk : "UNKNOWN"} />
  );
};
