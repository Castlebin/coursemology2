import { useLoaderData } from 'react-router-dom';
import { AnnouncementMiniEntity } from 'types/course/announcements';

import GlobalAPI from 'api';

interface AppLoaderData {
  announcements: AnnouncementMiniEntity[];
}

export const loader = async (): Promise<AppLoaderData> => {
  return {
    announcements: (await GlobalAPI.announcements.unread()).data,
  };
};

export const useAppLoader = (): AppLoaderData =>
  useLoaderData() as AppLoaderData;
