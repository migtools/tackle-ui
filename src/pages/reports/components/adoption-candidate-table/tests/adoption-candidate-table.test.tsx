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
import { Review } from "api/models";
import {
  TableRowData,
  ColumnIndex,
  compareToByColumn,
} from "../adoption-candidate-table";

describe("AdoptionCandidateTable", () => {
  const genericReview: Review = {
    businessCriticality: 999,
    workPriority: 999,
    effortEstimate: "small",
    proposedAction: "refactor",
  };

  it("Sort by criticality: criticality=zero is greater than review=undefined", () => {
    // Given
    const rows: TableRowData[] = [
      {
        application: {
          name: "app0",
          review: { ...genericReview, businessCriticality: 0 },
        },
      },
      {
        application: {
          name: "app1",
          review: { ...genericReview, businessCriticality: 1 },
        },
      },
      {
        application: {
          name: "app2",
          review: { ...genericReview, businessCriticality: 2 },
        },
      },
      { application: { name: "appUndefined1", review: undefined } },
      { application: { name: "appUndefined2", review: undefined } },
    ];

    // When
    rows.sort((a, b) => compareToByColumn(a, b, ColumnIndex.CRITICALITY));

    // Then
    expect(rows[0].application.name).toBe("appUndefined1");
    expect(rows[1].application.name).toBe("appUndefined2");
    expect(rows[2].application.name).toBe("app0");
    expect(rows[3].application.name).toBe("app1");
    expect(rows[4].application.name).toBe("app2");
  });

  it("Sort by priority: priority=zero is greater than review=undefined", () => {
    // Given
    const rows: TableRowData[] = [
      {
        application: {
          name: "app0",
          review: { ...genericReview, workPriority: 0 },
        },
      },
      {
        application: {
          name: "app1",
          review: { ...genericReview, workPriority: 1 },
        },
      },
      {
        application: {
          name: "app2",
          review: { ...genericReview, workPriority: 2 },
        },
      },
      { application: { name: "appUndefined1", review: undefined } },
      { application: { name: "appUndefined2", review: undefined } },
    ];

    // When
    rows.sort((a, b) => compareToByColumn(a, b, ColumnIndex.PRIORITY));

    // Then
    expect(rows[0].application.name).toBe("appUndefined1");
    expect(rows[1].application.name).toBe("appUndefined2");
    expect(rows[2].application.name).toBe("app0");
    expect(rows[3].application.name).toBe("app1");
    expect(rows[4].application.name).toBe("app2");
  });

  it("Sort by confidence: confidence=zero is greater than confidence=undefined", () => {
    // Given
    const rows: TableRowData[] = [
      { application: { name: "app0" }, confidence: 0 },
      { application: { name: "app1" }, confidence: 1 },
      { application: { name: "app2" }, confidence: 2 },
      { application: { name: "appUndefined1" }, confidence: undefined },
      { application: { name: "appUndefined2" }, confidence: undefined },
    ];

    // When
    rows.sort((a, b) => compareToByColumn(a, b, ColumnIndex.CONFIDENCE));

    // Then
    expect(rows[0].application.name).toBe("appUndefined1");
    expect(rows[1].application.name).toBe("appUndefined2");
    expect(rows[2].application.name).toBe("app0");
    expect(rows[3].application.name).toBe("app1");
    expect(rows[4].application.name).toBe("app2");
  });
});
