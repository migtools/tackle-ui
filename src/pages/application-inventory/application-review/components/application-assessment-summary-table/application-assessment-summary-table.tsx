import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Assessment,
  AssessmentAnswerRisk,
  Question,
  Questionnaire,
} from "api/models";
import {
  cellWidth,
  ICell,
  IRow,
  Table,
  TableBody,
  TableHeader,
  TableText,
} from "@patternfly/react-table";
import { Label } from "@patternfly/react-core";

interface ITableData {
  questionValue: string;
  answerValue?: string;
  riskValue: AssessmentAnswerRisk;
}

export interface IApplicationAssessmentSummaryTableProps {
  assessment: Assessment;
}

export const ApplicationAssessmentSummaryTable: React.FC<IApplicationAssessmentSummaryTableProps> = ({
  assessment,
}) => {
  const { t } = useTranslation();

  const tableData: ITableData[] = useMemo(() => {
    return assessment.questionnaire.categories
      .slice(0)
      .sort((a, b) => a.order - b.order)
      .flatMap((f) => f.questions)
      .map((f) => {
        return {
          questionValue: f.question,
          answerValue: f.options.find((q) => q.checked === true)?.option,
          riskValue: f.options.find((q) => q.checked === true)?.risk,
        } as ITableData;
      });
  }, [assessment]);

  const columns: ICell[] = [
    {
      title: t("terms.question"),
      transforms: [cellWidth(45)],
      cellFormatters: [],
    },
    {
      title: t("terms.answer"),
      transforms: [cellWidth(45)],
      cellFormatters: [],
    },
    {
      title: t("terms.risk"),
      transforms: [cellWidth(10)],
      cellFormatters: [],
    },
  ];

  const rows: IRow[] = [];
  tableData.forEach((item) => {
    let riskLabel = <Label color="green">Green</Label>;
    if (item.riskValue === "GREEN") {
      riskLabel = <Label color="green">Green</Label>;
    } else if (item.riskValue === "AMBER") {
      riskLabel = <Label color="orange">Amber</Label>;
    } else if (item.riskValue === "RED") {
      riskLabel = <Label color="red">Red</Label>;
    } else {
      riskLabel = <Label color="grey">Unknown</Label>;
    }

    rows.push({
      cells: [
        {
          title: (
            <TableText wrapModifier="truncate">{item.questionValue}</TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">{item.answerValue}</TableText>
          ),
        },
        {
          title: riskLabel,
        },
      ],
    });
  });

  return (
    <Table aria-label="assessment-summary-table" cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};
