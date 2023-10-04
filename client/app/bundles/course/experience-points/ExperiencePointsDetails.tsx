import { useState } from 'react';
import { defineMessages } from 'react-intl';
import { ExperiencePointsNameFilterData } from 'types/course/experiencePointsRecords';

import { setNotification } from 'lib/actions';
import BackendPagination from 'lib/components/core/layouts/BackendPagination';
import Page from 'lib/components/core/layouts/Page';
import LoadingIndicator from 'lib/components/core/LoadingIndicator';
import Preload from 'lib/components/wrappers/Preload';
import pollJob from 'lib/helpers/jobHelpers';
import { useAppDispatch } from 'lib/hooks/store';

import ExperiencePointsTable from './components/ExperiencePointsTable';
import ExperiencePointsFilterDownload from './ExperiencePointsFilterDownload';
import {
  downloadExperiencePoints,
  ExperiencePointsData,
  fetchAllExperiencePointsRecord,
} from './operations';

const ROWS_PER_PAGE = 25 as const;

const translations = defineMessages({
  experiencePointsHistory: {
    id: 'course.users.ExperiencePointsRecords.experiencePointsHistory',
    defaultMessage: 'Experience Points History',
  },
  downloadRequestSuccess: {
    id: 'course.experiencePoints.downloadRequestSuccess',
    defaultMessage: 'Your request to download is successful',
  },
  requestFailure: {
    id: 'course.experiencePoints.requestFailure',
    defaultMessage: 'An error occurred while processing your request.',
  },
  downloadPending: {
    id: 'course.experiencePoints.downloadPending',
    defaultMessage:
      'Please wait as your request to download is being processed.',
  },
});

const DOWNLOAD_JOB_POLL_INTERVAL_MS = 2000;

const ExperiencePointsDetails = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const [pageNum, setPageNum] = useState(1);

  // For filtering
  const [selectedFilter, setSelectedFilter] = useState<{
    name: ExperiencePointsNameFilterData | null;
  }>({
    name: null,
  });

  const studentFilterId = selectedFilter.name ? selectedFilter.name.id : null;

  const fetchExperienceInPage = (): ExperiencePointsData => {
    return fetchAllExperiencePointsRecord(studentFilterId, pageNum);
  };

  const handleDownloadSuccess = (successData): void => {
    window.location.href = successData.redirectUrl;
    dispatch(setNotification(translations.downloadRequestSuccess));
  };

  const handleDownloadFailure = (error): void => {
    const message =
      error?.response?.data?.error ||
      error?.message ||
      translations.requestFailure;
    dispatch(setNotification(message));
  };

  const handleOnClick = (): void => {
    downloadExperiencePoints(studentFilterId)
      .then((data) => {
        dispatch(setNotification(translations.downloadPending));
        pollJob(
          data.jobUrl,
          handleDownloadSuccess,
          handleDownloadFailure,
          DOWNLOAD_JOB_POLL_INTERVAL_MS,
        );
      })
      .catch(handleDownloadFailure);
  };

  return (
    <Preload
      render={<LoadingIndicator />}
      syncsWith={[pageNum, selectedFilter]}
      while={fetchExperienceInPage}
    >
      {(data): JSX.Element => (
        <Page unpadded>
          <Page.PaddedSection>
            <ExperiencePointsFilterDownload
              filter={data.filter}
              onClick={handleOnClick}
              selectedFilter={selectedFilter}
              setPageNum={setPageNum}
              setSelectedFilter={setSelectedFilter}
            />
          </Page.PaddedSection>

          <BackendPagination
            handlePageChange={setPageNum}
            pageNum={pageNum}
            rowCount={data.rowCount}
            rowsPerPage={ROWS_PER_PAGE}
          />

          <ExperiencePointsTable records={data.experiencePointRecords} />
        </Page>
      )}
    </Preload>
  );
};

export default ExperiencePointsDetails;
