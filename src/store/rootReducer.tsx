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
import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";

import { notificationsReducer } from "@redhat-cloud-services/frontend-components-notifications/redux";
import { confirmDialogStateKey, confirmDialogReducer } from "./confirmDialog";
import { unknownTagsStateKey, unknownTagsReducer } from "./unknownTags";
import { bulkCopyStateKey, bulkCopyReducer } from "./bulkCopy";

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  notifications: notificationsReducer,
  [confirmDialogStateKey]: confirmDialogReducer,
  [unknownTagsStateKey]: unknownTagsReducer,
  [bulkCopyStateKey]: bulkCopyReducer,
});
