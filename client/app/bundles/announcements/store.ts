import produce from 'immer';

import {
  GlobalActionType,
  GlobalAnnouncementState,
  SAVE_ANNOUNCEMENT_LIST,
  SaveAnnouncementListAction,
} from './types';
import {
  createEntityStore,
  removeAllFromStore,
  saveListToStore,
} from 'utilities/store';
import { AnnouncementListData } from 'types/course/announcements';

const initialState: GlobalAnnouncementState = {
  announcements: createEntityStore(),
};

const reducer = produce(
  (draft: GlobalAnnouncementState, action: GlobalActionType) => {
    switch (action.type) {
      case SAVE_ANNOUNCEMENT_LIST: {
        const announcementList = action.announcements;
        const entityList = announcementList.map((data) => ({ ...data }));
        removeAllFromStore(draft.announcements);
        saveListToStore(draft.announcements, entityList);
        break;
      }
      default:
        break;
    }
  },
  initialState,
);

export function saveAnnouncementsList(
  announcements: AnnouncementListData[],
): SaveAnnouncementListAction {
  return {
    type: SAVE_ANNOUNCEMENT_LIST,
    announcements,
  };
}

export default reducer;
