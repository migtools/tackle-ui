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
import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";

import {
  ActionGroup,
  Alert,
  Button,
  FileUpload,
  Form,
  FormGroup,
} from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { UPLOAD_FILE } from "api/rest";
import { getAxiosErrorMessage } from "utils/utils";

export interface ImportApplicationsFormProps {
  onSaved: (response: AxiosResponse) => void;
}

export const ImportApplicationsForm: React.FC<ImportApplicationsFormProps> = ({
  onSaved,
}) => {
  const { t } = useTranslation();

  const [file, setFile] = useState<File>();
  const [isFileRejected, setIsFileRejected] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AxiosError>();

  // Redux
  const dispatch = useDispatch();

  // Actions
  const handleFileRejected = () => {
    setIsFileRejected(true);
  };

  const onSubmit = () => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    formData.set("fileName", file.name);
    const config = {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };
    setIsSubmitting(true);
    axios
      .post(UPLOAD_FILE, formData, config)
      .then((response) => {
        dispatch(
          alertActions.addSuccess(t("toastr.success.fileSavedToBeProcessed"))
        );

        setIsSubmitting(false);
        onSaved(response);
      })
      .catch((error) => {
        setIsSubmitting(false);
        setError(error);
      });
  };
  return (
    <Form>
      {error && <Alert variant="danger" title={getAxiosErrorMessage(error)} />}

      <FormGroup
        fieldId="file"
        label={t("terms.uploadApplicationFile")}
        helperTextInvalid="You should select a CSV file."
        validated={isFileRejected ? "error" : "default"}
      >
        <FileUpload
          id="file"
          name="file"
          value={file}
          filename={file?.name}
          onChange={(value, filename) => {
            if (filename && typeof value !== "string") {
              setFile(value);
              setIsFileRejected(false);
            } else if (!filename) {
              setFile(undefined);
            }
          }}
          dropzoneProps={{
            accept: ".csv",
            onDropRejected: handleFileRejected,
          }}
          validated={isFileRejected ? "error" : "default"}
        />
      </FormGroup>
      <ActionGroup>
        <Button
          variant="primary"
          onClick={onSubmit}
          isDisabled={!file || isSubmitting}
        >
          {t("actions.import")}
        </Button>
      </ActionGroup>
    </Form>
  );
};
