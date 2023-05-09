/* eslint-disable import/prefer-default-export */
import { AnnouncementData } from 'types/course/announcements';

import { SAVE_ANNOUNCEMENT_LIST, SaveAnnouncementListAction } from './types';

export function saveAnnouncementsList(
  announcements: AnnouncementData[],
): SaveAnnouncementListAction {
  return {
    type: SAVE_ANNOUNCEMENT_LIST,
    announcements,
  };
}
