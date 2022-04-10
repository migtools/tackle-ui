import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";

import { Button, ButtonVariant, Modal, Text } from "@patternfly/react-core";

import { useDispatch } from "react-redux";
import { confirmDialogActions } from "store/confirmDialog";

import { PageHeader, VisibilityByPermission } from "shared/components";
import { useEntityModal } from "shared/hooks";
import { ApplicationDependenciesFormContainer } from "shared/containers";

import { Paths } from "Paths";
import { Application, Assessment } from "api/models";
import { getApplicationById } from "api/rest";

export interface IApplicationAssessmentPageHeaderProps {
  assessment?: Assessment;
}

export const ApplicationAssessmentPageHeader: React.FC<IApplicationAssessmentPageHeaderProps> = ({
  assessment,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [application, setApplication] = useState<Application>();

  useEffect(() => {
    if (assessment) {
      getApplicationById(assessment.applicationId).then(({ data }) => {
        setApplication(data);
      });
    }
  }, [assessment]);

  // Dependencies modal
  const {
    isOpen: isDependenciesModalOpen,
    data: applicationToManageDependencies,
    update: openDependenciesModal,
    close: closeDependenciesModal,
  } = useEntityModal<Application>();

  return (
    <>
      <PageHeader
        title={t("composed.applicationAssessment")}
        description={<Text component="p">{application?.name}</Text>}
        breadcrumbs={[
          {
            title: t("terms.applications"),
            path: () => {
              dispatch(
                confirmDialogActions.openDialog({
                  title: t("dialog.title.leavePage"),
                  message: t("dialog.message.leavePage"),
                  confirmBtnVariant: ButtonVariant.primary,
                  confirmBtnLabel: t("actions.continue"),
                  cancelBtnLabel: t("actions.cancel"),
                  onConfirm: () => {
                    dispatch(confirmDialogActions.closeDialog());
                    history.push(Paths.applicationInventory_applicationList);
                  },
                })
              );
            },
          },
          {
            title: t("terms.assessment"),
            path: Paths.applicationInventory_assessment,
          },
        ]}
        btnActions={
          <>
            {application && (
              <VisibilityByPermission
                permissionsAllowed={["inventory:application-dependency:write"]}
              >
                <Button onClick={() => openDependenciesModal(application)}>
                  {t("actions.manageDependencies")}
                </Button>
              </VisibilityByPermission>
            )}
          </>
        }
        menuActions={[]}
      />

      <Modal
        isOpen={isDependenciesModalOpen}
        variant="medium"
        title={t("composed.manageDependenciesFor", {
          what: applicationToManageDependencies?.name,
        })}
        onClose={closeDependenciesModal}
      >
        {applicationToManageDependencies && (
          <ApplicationDependenciesFormContainer
            application={applicationToManageDependencies}
            onCancel={closeDependenciesModal}
          />
        )}
      </Modal>
    </>
  );
};
