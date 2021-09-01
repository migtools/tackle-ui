import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";

import { notificationsReducer } from "@redhat-cloud-services/frontend-components-notifications/redux";
import { confirmDialogStateKey, confirmDialogReducer } from "./confirmDialog";

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  notifications: notificationsReducer,
  [confirmDialogStateKey]: confirmDialogReducer,
});
