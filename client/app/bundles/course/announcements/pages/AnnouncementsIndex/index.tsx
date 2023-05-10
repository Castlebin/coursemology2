import { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';
import { FetchAnnouncementsData } from 'types/course/announcements';

import Note from 'lib/components/core/Note';
import PageHeader from 'lib/components/navigation/PageHeader';
import deferred, {
  createDeferredHandler,
  deferrable,
  DeferredHandler,
} from 'lib/hooks/router/defer';
import { dispatchable, loads } from 'lib/hooks/router/loaders';
import useTranslation from 'lib/hooks/useTranslation';

import NewAnnouncementButton from '../../components/buttons/NewAnnouncementButton';
import AnnouncementsDisplay from '../../components/misc/AnnouncementsDisplay';
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  updateAnnouncement,
} from '../../operations';
import {
  getAllAnnouncementMiniEntities,
  getAnnouncementPermissions,
} from '../../selectors';
import AnnouncementNew from '../AnnouncementNew';

const translations = defineMessages({
  fetchAnnouncementsFailure: {
    id: 'course.announcements.AnnouncementsIndex.fetchAnnouncementsFailure',
    defaultMessage: 'Failed to fetch announcements',
  },
  header: {
    id: 'course.announcements.AnnouncementsIndex.header',
    defaultMessage: 'Announcements',
  },
  noAnnouncements: {
    id: 'course.announcements.AnnouncementsIndex.noAnnouncements',
    defaultMessage: 'There are no announcements',
  },
  searchBarPlaceholder: {
    id: 'course.announcements.AnnouncementsIndex.searchBarPlaceholder',
    defaultMessage: 'Search by announcement title',
  },
});

const AnnouncementsIndex = (): JSX.Element => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const announcements = useSelector(getAllAnnouncementMiniEntities);
  const announcementPermissions = useSelector(getAnnouncementPermissions);

  return (
    <>
      <PageHeader
        title={t(translations.header)}
        toolbars={
          announcementPermissions.canCreate
            ? [
                <NewAnnouncementButton
                  key="new-announcement-button"
                  setIsOpen={setIsOpen}
                />,
              ]
            : undefined
        }
      />

      {announcements.length === 0 ? (
        <Note message={t(translations.noAnnouncements)} />
      ) : (
        <AnnouncementsDisplay
          announcementPermissions={announcementPermissions}
          announcements={announcements}
          deleteOperation={deleteAnnouncement}
          updateOperation={updateAnnouncement}
        />
      )}
      <AnnouncementNew
        createOperation={createAnnouncement}
        onClose={(): void => setIsOpen(false)}
        open={isOpen}
      />
    </>
  );
};

const loader = dispatchable((dispatch) =>
  deferrable(fetchAnnouncements(dispatch)),
);

const handle: DeferredHandler<FetchAnnouncementsData> = createDeferredHandler(
  (_, data) => data.pageTitle,
);

export default loads(deferred(AnnouncementsIndex), { loader, handle });
