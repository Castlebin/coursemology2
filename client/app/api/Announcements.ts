import {
  AnnouncementData,
  AnnouncementListData,
} from 'types/course/announcements';

import BaseAPI from './Base';
import { APIResponse } from './types';

export default class AnnouncementsAPI extends BaseAPI {
  // eslint-disable-next-line class-methods-use-this
  get #urlPrefix(): string {
    return `/announcements`;
  }

  /**
   * Fetches all the announcements (admin and instance announcements)
   */
  index(): APIResponse<{
    announcements: AnnouncementData[];
  }> {
    return this.client.get(this.#urlPrefix);
  }

  unread(): APIResponse<AnnouncementListData[]> {
    return this.client.get(`${this.#urlPrefix}/unread`);
  }

  markAsRead(url: string): APIResponse {
    return this.client.post(url);
  }
}
