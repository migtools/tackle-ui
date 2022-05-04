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
import { useTranslation } from "react-i18next";

import {
  Pagination,
  PaginationVariant,
  ToggleTemplate,
} from "@patternfly/react-core";

export interface SimplePaginationProps {
  count: number;
  params: {
    perPage?: number;
    page?: number;
  };

  isTop?: boolean;
  isCompact?: boolean;
  perPageOptions?: number[];
  onChange: ({ page, perPage }: { page: number; perPage: number }) => void;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  count,
  params,
  isTop,
  isCompact,
  perPageOptions,
  onChange,
}) => {
  const { t } = useTranslation();

  const mapPerPageOptions = (options: number[]) => {
    return options.map((option) => ({
      title: String(option),
      value: option,
    }));
  };

  const getPerPage = () => {
    return params.perPage || 10;
  };

  return (
    <Pagination
      itemCount={count}
      page={params.page || 1}
      perPage={getPerPage()}
      onPageInput={(_, page) => {
        onChange({ page, perPage: getPerPage() });
      }}
      onSetPage={(_, page) => {
        onChange({ page, perPage: getPerPage() });
      }}
      onPerPageSelect={(_, perPage) => {
        onChange({ page: 1, perPage });
      }}
      isCompact={isTop || isCompact}
      widgetId="pagination-options-menu"
      variant={isTop ? PaginationVariant.top : PaginationVariant.bottom}
      perPageOptions={mapPerPageOptions(perPageOptions || [10, 20, 50, 100])}
      titles={{
        ofWord: t("terms.of").toLowerCase(),
        perPageSuffix: t("terms.perPageSuffix").toLowerCase(),
      }}
      toggleTemplate={(props) => (
        <ToggleTemplate {...props} ofWord={t("terms.of").toLowerCase()} />
      )}
    />
  );
};
